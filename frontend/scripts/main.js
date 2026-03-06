function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
}

function initAccordions() {
  document.querySelectorAll('[data-accordion-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const article = trigger.closest('article');
      const body = article.querySelector('[data-accordion-body]');
      const icon = article.querySelector('[data-accordion-icon]');
      const isHidden = body.classList.contains('hidden');

      body.classList.toggle('hidden', !isHidden);
      if (icon) {
        icon.textContent = isHidden ? '-' : '+';
      }
    });
  });
}

function initNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  const closeButton = document.querySelector('[data-nav-close]');

  if (!toggle || !panel) {
    return;
  }

  const setOpen = (open) => {
    panel.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
  };

  toggle.addEventListener('click', () => setOpen(true));
  if (closeButton) {
    closeButton.addEventListener('click', () => setOpen(false));
  }

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

function initFilters() {
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const state = {};
    const items = Array.from(group.querySelectorAll('[data-filter-item]'));
    const count = group.querySelector('[data-filter-count]');

    const applyFilters = () => {
      let visibleCount = 0;
      items.forEach((item) => {
        const searchTerm = (state.search || '').trim().toLowerCase();
        const searchSource = (item.dataset.search || '').toLowerCase();
        const matchesSearch = !searchTerm || searchSource.includes(searchTerm);

        const activeKeys = Object.keys(state).filter((key) => key !== 'search' && state[key] && state[key] !== 'All');
        const matchesKeys = activeKeys.every((key) => (item.dataset[key] || '') === state[key]);

        const visible = matchesSearch && matchesKeys;
        item.classList.toggle('hidden', !visible);
        if (visible) {
          visibleCount += 1;
        }
      });

      if (count) {
        count.textContent = String(visibleCount);
      }
    };

    group.querySelectorAll('[data-filter-chip]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const key = chip.dataset.filterKey;
        const value = chip.dataset.filterValue;
        state[key] = value;

        group.querySelectorAll(`[data-filter-chip][data-filter-key="${key}"]`).forEach((peer) => {
          peer.classList.toggle('is-active', peer === chip);
        });

        applyFilters();
      });
    });

    group.querySelectorAll('[data-filter-control]').forEach((control) => {
      control.addEventListener('input', () => {
        const key = control.dataset.filterKey;
        state[key] = control.value;
        applyFilters();
      });
      control.addEventListener('change', () => {
        const key = control.dataset.filterKey;
        state[key] = control.value;
        applyFilters();
      });
    });

    applyFilters();
  });
}

function initChatWidget() {
  const widget = document.querySelector('[data-chat-widget]');
  if (!widget) {
    return;
  }

  const openButton = widget.querySelector('[data-chat-open]');
  const closeButton = widget.querySelector('[data-chat-close]');
  const panel = widget.querySelector('[data-chat-panel]');
  const form = widget.querySelector('[data-chat-form]');
  const thread = widget.querySelector('[data-chat-thread]');
  const feedback = widget.querySelector('[data-chat-feedback]');
  const topicInput = form?.querySelector('input[name="topic"]');
  const messageInput = form?.querySelector('textarea[name="message"]');
  const firstInput = form?.querySelector('input[name="name"]');
  const submitButton = widget.querySelector('[data-chat-submit]');

  if (!openButton || !panel || !form || !thread || !feedback || !topicInput || !messageInput || !submitButton || !firstInput) {
    return;
  }

  const setOpen = (open) => {
    panel.classList.toggle('hidden', !open);
    widget.classList.toggle('is-open', open);
    openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      window.setTimeout(() => firstInput.focus(), 80);
    }
  };

  const appendBubble = (content, kind = 'bot') => {
    const bubble = document.createElement('div');
    bubble.className = kind === 'user'
      ? 'chat-dock__bubble chat-dock__bubble--user'
      : 'chat-dock__bubble chat-dock__bubble--bot';
    bubble.textContent = content;
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
  };

  openButton.addEventListener('click', () => setOpen(!widget.classList.contains('is-open')));
  if (closeButton) {
    closeButton.addEventListener('click', () => setOpen(false));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!widget.classList.contains('is-open')) {
      return;
    }

    if (!widget.contains(event.target)) {
      setOpen(false);
    }
  });

  widget.querySelectorAll('[data-chat-intent]').forEach((button) => {
    button.addEventListener('click', () => {
      const topic = button.getAttribute('data-chat-intent') || '';
      topicInput.value = topic;
      messageInput.value = topic ? `I need help with ${topic}.` : '';
      appendBubble(topic, 'user');
      appendBubble(`Noted. We will route this as "${topic}" to the designated manager once you send your details.`, 'bot');
      messageInput.focus();
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.classList.add('hidden');
    feedback.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const formData = new FormData(form);
    const message = String(formData.get('message') || '').trim();

    if (message) {
      appendBubble(message, 'user');
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(Array.from(formData.entries()))
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Unable to send the chat right now.');
      }

      appendBubble('Your message has been sent. The designated manager has been notified and will follow up soon.', 'bot');
      feedback.textContent = payload.message || 'Chat sent successfully.';
      feedback.className = 'chat-dock__feedback chat-dock__feedback--success';
      form.reset();
      topicInput.value = '';
    } catch (error) {
      appendBubble('We could not send your message right now. Please try again or use the contact page.', 'bot');
      feedback.textContent = error.message;
      feedback.className = 'chat-dock__feedback chat-dock__feedback--error';
    } finally {
      feedback.classList.remove('hidden');
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initAccordions();
  initNav();
  initFilters();
  initChatWidget();
});

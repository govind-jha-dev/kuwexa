module.exports = {
  content: [
    './frontend/**/*.ejs',
    './dashboard/**/*.ejs',
    './backend/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        surface: 'var(--surface)'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        float: '0 24px 60px rgba(0, 36, 10, 0.12)'
      }
    }
  }
};

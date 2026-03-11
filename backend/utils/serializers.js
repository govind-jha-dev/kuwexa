function parseJsonValue(value, fallback) {
  if (!value) {
    return fallback;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function parseJsonFields(row, fields = []) {
  if (!row) {
    return row;
  }

  const copy = { ...row };
  fields.forEach((field) => {
    copy[field] = parseJsonValue(copy[field], Array.isArray(copy[field]) ? [] : null);
  });
  return copy;
}

function parseMany(rows, fields = []) {
  return rows.map((row) => parseJsonFields(row, fields));
}

function splitCsv(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

module.exports = {
  parseJsonValue,
  parseJsonFields,
  parseMany,
  splitCsv
};

function buildUpdateClause(fields) {
  const definedEntries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (!definedEntries.length) {
    return {
      clause: '',
      values: []
    };
  }

  return {
    clause: definedEntries.map(([key]) => `${key} = ?`).join(', '),
    values: definedEntries.map(([, value]) => value)
  };
}

module.exports = {
  buildUpdateClause
};

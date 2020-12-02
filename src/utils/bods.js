const latest = (statements) => {
  const replaced = new Set(statements.flatMap((s) => s.replaces));
  return statements.filter((s) => !replaced.has(s.id));
};

export default latest;

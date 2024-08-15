const latest = (statements, version) => {
  if (version === '0.4') {
    const statementMap = {};

    statements.forEach((statement) => {
      const { recordId, statementDate } = statement;
      if (
        !statementMap[recordId] ||
        new Date(statementDate) > new Date(statementMap[recordId].statementDate)
      ) {
        statementMap[recordId] = statement;
      }
    });

    return Object.values(statementMap);
  } else {
    const replaced = new Set(statements.flatMap((s) => s.replaces));
    return statements.filter((s) => !replaced.has(s.id));
  }
};

export default latest;

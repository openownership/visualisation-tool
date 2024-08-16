export const closedRecords = new Set();

export const latest = (statements, closedRecords, version) => {
  if (version === '0.4') {
    const statementMap = {};

    statements.forEach((statement) => {
      const { recordId, recordStatus, source } = statement;

      if (recordStatus === 'closed') {
        closedRecords.add(recordId);
        closedRecords.add(source);
      }
    });

    statements.forEach((statement) => {
      const { recordId, statementDate, recordStatus } = statement;

      if (recordStatus === 'closed' || closedRecords.has(recordId)) {
        return;
      }

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

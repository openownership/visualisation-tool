import { compareVersions } from 'compare-versions';
export const closedRecords = new Set();
export const changedRecords = new Set();

export const getDates = (statements) => {
  const uniqueDates = new Set();

  for (const statement of statements) {
    if (!uniqueDates.has(statement.statementDate)) {
      uniqueDates.add(statement.statementDate);
    }
  }

  const arr = Array.from(uniqueDates);
  return arr.sort((a, b) => {
    return a - b;
  });
};

export const filteredData = (statements, selectedDate, version) => {
  if (compareVersions(version, '0.4') >= 0) {
    // get all statements with matching recordId and recordType values
    const recordIdCount = {};

    for (const statement of statements) {
      const key = `${statement.recordId}-${statement.recordType}`;
      recordIdCount[key] = (recordIdCount[key] || 0) + 1;
    }

    const duplicateStatements = statements.filter((statement) => {
      const key = `${statement.recordId}-${statement.recordType}`;
      return recordIdCount[key] > 1;
    });

    const uniqueStatements = statements.filter((statement) => {
      const key = `${statement.recordId}-${statement.recordType}`;
      return recordIdCount[key] === 1;
    });

    // remove all statements outside of selectedDate
    const filteredByDate = duplicateStatements.filter((statement) => {
      return statement.statementDate <= selectedDate;
    });

    // remove all statements but most recent of those already filtered by date
    const filteredByRecency = Object.values(
      filteredByDate.reduce((acc, statement) => {
        const key = `${statement.recordId}-${statement.recordType}`;
        if (!acc[key] || new Date(statement.statementDate) > new Date(acc[key].statementDate)) {
          acc[key] = statement;
        }
        return acc;
      }, {})
    );

    // remove closed records of various types
    const filterByRecordStatus = (array) => {
      return array.filter((statement) => {
        if (statement.recordStatus === 'closed') {
          return false;
        }

        if (
          statement.recordType === 'entity' &&
          statement.dissolutionDate &&
          new Date(statement.dissolutionDate) <= new Date(selectedDate)
        ) {
          return false;
        }

        if (
          statement.recordType === 'person' &&
          statement.deathDate &&
          new Date(statement.deathDate) <= new Date(selectedDate)
        ) {
          return false;
        }

        if (statement.recordType === 'relationship' && statement.recordDetails?.interests) {
          statement.recordDetails.interests = statement.recordDetails.interests.filter((interest) => {
            return !interest.endDate || new Date(interest.endDate) > new Date(selectedDate);
          });

          if (statement.recordDetails.interests.length === 0) {
            return false;
          }
        }

        return true;
      });
    };

    const dupsFilteredByStatus = filterByRecordStatus(filteredByRecency);
    const uniqueFilteredByStatus = filterByRecordStatus(uniqueStatements);

    // filter original statements to only show selectedStatements
    const selectedStatements = statements.filter(
      (statement) =>
        dupsFilteredByStatus.length === 0 ||
        dupsFilteredByStatus.some(
          (filtered) =>
            filtered.recordId === statement.recordId &&
            filtered.recordType === statement.recordType &&
            filtered.statementDate === statement.statementDate
        )
    );

    return [...selectedStatements, ...uniqueFilteredByStatus];
  } else {
    // get all statements with statementID values in replacesStatements array
    const nodeTypes = ['ownershipOrControlStatement', 'entityStatement', 'personStatement'];
    const replacedStatements = new Set();

    statements.forEach((statement) => {
      if (nodeTypes.includes(statement.statementType)) {
        (statement.replacesStatements || []).forEach((id) => replacedStatements.add(id));
      }
    });

    return statements.filter((statement) => {
      return !(replacedStatements.has(statement.statementID) && nodeTypes.includes(statement.statementType));
    });
  }
};

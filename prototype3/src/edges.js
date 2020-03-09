export const getOwnershipEdges = bodsData => {
  return bodsData
    .filter(
      statement => statement.statementType === "ownershipOrControlStatement"
    )
    .map(statement => {
      const { statementID, subject, interestedParty, interests } = statement;
      console.log(statementID, interests);

      return {
        id: statementID,
        label: interests[0] ? interests[0].share.exact : "Unknown",
        source: interestedParty.describedByPersonStatement
          ? interestedParty.describedByPersonStatement
          : interestedParty.describedByEntityStatement,
        target: subject.describedByPersonStatement
          ? subject.describedByPersonStatement
          : subject.describedByEntityStatement
      };
    });
};
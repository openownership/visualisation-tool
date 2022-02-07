// import generateNodeLabel from './nodeHTMLLabel';
import generateNodeLabel from './nodeSVGLabel';
import latest from '../utils/bods';
import sanitise from '../utils/sanitiser';

const unknownNode = [
  {
    statementID: 'unknown',
    statementType: 'personStatement',
    names: [{ fullName: 'Unknown Person' }],
  },
];

const nodeConfig = {
  shape: 'circle',
  width: 100,
  style: 'opacity: 1; fill: #f7f7f7; stroke: #444; stroke-width: 1px;',
};

const personName = (name, personType) => {
  if (Object.keys(name).length === 0) {
    if (personType === 'anonymousPerson') {
      return 'Anonymous Person';
    } else if (personType === 'unknownPerson') {
      return 'Unknown Person';
    } else {
      return 'Unamed Person';
    }
  }
  if (name.fullName) {
    return name.fullName;
  }
  const nameParts = [name.givenName, name.patronymicName, name.familyName].filter(
    (namePart) => namePart !== null
  );
  return nameParts.join(' ');
};

export const getPersonNodes = (bodsData) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'personStatement')
      .map((statement) => {
        const { statementID, names, personType, nationalities = null } = statement;
        const nodeType = statementID === 'unknown' ? 'unknown' : 'person';
        const countryCode = nationalities ? nationalities[0].code : null;
        const name = names ? names[0] : {};
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        return {
          id: statementID,
          label: generateNodeLabel(personName(name)),
          labelType: 'svg',
          class: nodeType,
          config: nodeConfig,
          replaces: replaces,
          nodeType: sanitise(nodeType),
          countryCode: sanitise(countryCode),
        };
      })
  );
};

export const getEntityNodes = (bodsData) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'entityStatement')
      .map((statement) => {
        const { statementID, name, incorporatedInJurisdiction = null } = statement;
        const countryCode = incorporatedInJurisdiction ? incorporatedInJurisdiction.code : null;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        return {
          id: statementID,
          label: generateNodeLabel(name),
          labelType: 'svg',
          class: 'entity',
          nodeType: 'entity',
          countryCode: sanitise(countryCode),
          config: nodeConfig,
          replaces: replaces,
        };
      })
  );
};

export const setUnknownNode = (imagesPath) => getPersonNodes(unknownNode, imagesPath);

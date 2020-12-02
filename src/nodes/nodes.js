import generateNodeLabel from './nodeHTMLLabel';
import latest from '../utils/bods';

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
  style: 'opacity: 0; fill: #f7f7f7; stroke: #444; stroke-width: 1px;',
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

export const getPersonNodes = (bodsData, imagesPath) => {
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
          label: generateNodeLabel(nodeType, personName(name, personType), countryCode, imagesPath),
          labelType: 'html',
          class: nodeType,
          config: nodeConfig,
          replaces: replaces,
        };
      })
  );
};

export const getEntityNodes = (bodsData, imagesPath) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'entityStatement')
      .map((statement) => {
        const { statementID, name, incorporatedInJurisdiction = null } = statement;
        const countryCode = incorporatedInJurisdiction ? incorporatedInJurisdiction.code : null;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        return {
          id: statementID,
          label: generateNodeLabel('entity', name, countryCode, imagesPath),
          labelType: 'html',
          class: 'entity',
          config: nodeConfig,
          replaces: replaces,
        };
      })
  );
};

export const setUnknownNode = (imagesPath) => getPersonNodes(unknownNode, imagesPath);

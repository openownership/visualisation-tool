import generateNodeLabel from './nodeSVGLabel';
import latest from '../utils/bods';
import sanitise from '../utils/sanitiser';

const unknownNode = [
  {
    statementID: 'unknown',
    statementType: 'personStatement',
    personType: 'unknown',
    names: [{ fullName: 'Unknown Person(s)' }],
  },
];

const nodeConfig = {
  shape: 'circle',
  width: 100,
  style: 'opacity: 1; fill: #fff; stroke: #000; stroke-width: 4px;',
};

const personName = (names, personType) => {
  const personTypes = ['individual', 'transliteration', 'alternative', 'birth', 'translation', 'former'];
  const selectedName = names
    .slice()
    .sort((a, b) => personTypes.indexOf(a.type) - personTypes.indexOf(b.type))[0];

  if (Object.keys(selectedName).length === 0) {
    if (personType === 'anonymousPerson') {
      return 'Anonymous Person';
    } else if (personType === 'unknownPerson') {
      return 'Unknown Person';
    } else {
      return 'Unnamed Person';
    }
  }
  if (selectedName.fullName) {
    return selectedName.fullName;
  }
  const nameParts = [selectedName.givenName, selectedName.patronymicName, selectedName.familyName].filter(
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
        const countryCode = nationalities ? sanitise(nationalities[0].code) : null;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        const personLabel =
          names && names.length > 0 && personType
            ? generateNodeLabel(personName(names, personType))
            : generateNodeLabel('Unknown Person');
        return {
          id: statementID,
          label: personLabel,
          labelType: 'svg',
          class: personType,
          config: nodeConfig,
          replaces: replaces,
          nodeType: personType,
          countryCode: countryCode,
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
        const countryCode = incorporatedInJurisdiction ? sanitise(incorporatedInJurisdiction.code) : null;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        return {
          id: statementID,
          label: generateNodeLabel(name),
          labelType: 'svg',
          class: 'entity',
          nodeType: 'entity',
          countryCode: countryCode,
          config: nodeConfig,
          replaces: replaces,
        };
      })
  );
};

export const setUnknownNode = (imagesPath) => getPersonNodes(unknownNode, imagesPath);

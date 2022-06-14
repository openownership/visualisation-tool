import generateNodeLabel from './nodeSVGLabel';
import latest from '../utils/bods';
import sanitise from '../utils/sanitiser';

const unknownNode = (nodeId) => {
  return {
    statementID: nodeId,
    statementType: 'personStatement',
    personType: 'unknownPerson',
    names: [{ fullName: 'Unknown Person(s)' }],
  };
};

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
  if (nameParts.filter((name) => name).length > 0) {
    return nameParts.join(' ');
  } else return 'Unnamed Person';
};

let iconType = (nodeType) => {
  const iconFile = {
    knownPerson: 'bovs-person.svg',
    anonymousPerson: 'bovs-person-unknown.svg',
    unknownPerson: 'bovs-person-unknown.svg',
    registeredEntity: 'bovs-organisation.svg',
    registeredEntityListed: 'bovs-listed.svg',
    legalEntity: 'bovs-organisation.svg',
    arrangement: 'bovs-arrangement.svg',
    anonymousEntity: 'bovs-entity-unknown.svg',
    unknownEntity: 'bovs-entity-unknown.svg',
    state: 'bovs-state.svg',
    stateBody: 'bovs-statebody.svg',
  }[nodeType];

  return iconFile ? iconFile : 'bovs-unknown.svg';
};

export const getPersonNodes = (bodsData) => {
  return latest(
    bodsData
      .filter((statement) => statement.statementType === 'personStatement')
      .map((statement) => {
        const { statementID, names, personType, nationalities = null } = statement;
        const countryCode = nationalities && nationalities[0].code ? sanitise(nationalities[0].code) : null;
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
          nodeType: iconType(personType),
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
        const {
          statementID,
          name,
          entityType = 'unknown',
          publicListing = null,
          incorporatedInJurisdiction = null,
          jurisdiction = null,
        } = statement;

        // This gets the country code from v0.2 BODS (incorporatedInJurisdiction)
        // Or from v0.3 BODS (jurisdiction)
        const countryCode = incorporatedInJurisdiction
          ? sanitise(incorporatedInJurisdiction.code)
          : jurisdiction
          ? sanitise(jurisdiction.code)
          : null;
        const replaces = statement.replacesStatements ? statement.replacesStatements : [];
        const nodeType = publicListing?.hasPublicListing !== true ? entityType : 'registeredEntityListed';
        return {
          id: statementID,
          label: generateNodeLabel(name || ''),
          labelType: 'svg',
          class: entityType,
          nodeType: iconType(nodeType),
          countryCode: countryCode,
          config: nodeConfig,
          replaces: replaces,
        };
      })
  );
};

export const setUnknownNode = (source) => unknownNode(source);

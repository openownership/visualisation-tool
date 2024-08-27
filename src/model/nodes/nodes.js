import { compareVersions } from 'compare-versions';
import generateNodeLabel from './nodeSVGLabel';
import { closedRecords, latest } from '../../utils/bods';
import sanitise from '../../utils/sanitiser';

// This will generate a node when there unknown fields
const unknownNode = (nodeId) => {
  return {
    statementId: nodeId,
    statementID: nodeId,
    recordType: 'person',
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

// This sets up the order in which names should be selected from the data
const personName = (names, personType) => {
  const personTypes = [
    'individual',
    'legal',
    'transliteration',
    'alternative',
    'birth',
    'translation',
    'former',
  ];
  const selectedName = names
    .slice()
    .sort((a, b) => personTypes.indexOf(a.type) - personTypes.indexOf(b.type))[0];

  // This creates the personType if the person is anonymous, unknown, or unanmed and describes the conditions for each
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

// These are a direct mapping from the nodetype to the respresentative SVG element
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

// This builds up the required person object from the BODS data, using the functions above
export const getPersonNodes = (bodsData) => {
  const version = bodsData[0]?.publicationDetails?.bodsVersion || '0';

  const filteredData = bodsData.filter((statement) => {
    if (compareVersions(version, '0.4') >= 0) {
      return statement.recordType === 'person';
    } else {
      return statement.statementType === 'personStatement';
    }
  });

  const mappedData = filteredData.map((statement) => {
    const {
      statementID = null,
      statementId = null,
      statementDate = null,
      recordId = null,
      recordDetails = null,
      names = null,
      personType = null,
      nationalities = null,
    } = statement;
    const countryCode = nationalities && nationalities[0].code ? sanitise(nationalities[0].code) : null;
    const replaces = statement.replacesStatements ? statement.replacesStatements : [];

    const personNameData = recordDetails?.names || names;
    const personTypeData = recordDetails?.personType || personType;

    const personLabel =
      personNameData && personNameData.length > 0 && personTypeData
        ? generateNodeLabel(personName(personNameData, personTypeData))
        : generateNodeLabel('Unknown Person');
    return {
      id: statementId || statementID,
      statementDate,
      recordId,
      label: personLabel,
      labelType: 'svg',
      class: personType,
      config: nodeConfig,
      replaces: replaces,
      nodeType: iconType(personTypeData),
      countryCode: countryCode,
    };
  });

  return latest(mappedData, closedRecords, version);
};

// This builds up the required entity object from the BODS data, using the functions above
export const getEntityNodes = (bodsData) => {
  const version = bodsData[0]?.publicationDetails?.bodsVersion || '0';

  const filteredData = bodsData.filter((statement) => {
    if (compareVersions(version, '0.4') >= 0) {
      return statement.recordType === 'entity';
    } else {
      return statement.statementType === 'entityStatement';
    }
  });

  const mappedData = filteredData.map((statement) => {
    const {
      statementID = null,
      statementId = null,
      statementDate = null,
      recordId = null,
      recordDetails = null,
      name = null,
      entityType = 'unknown',
      publicListing = null,
      incorporatedInJurisdiction = null,
      jurisdiction = null,
    } = statement;

    let countryCode;

    if (compareVersions(version, '0.4') >= 0) {
      countryCode = recordDetails.jurisdiction ? sanitise(recordDetails.jurisdiction.code) : null;
    } else {
      // This gets the country code from v0.2 BODS (incorporatedInJurisdiction)
      // Or from v0.3 BODS (jurisdiction)
      countryCode = incorporatedInJurisdiction
        ? sanitise(incorporatedInJurisdiction.code)
        : jurisdiction
        ? sanitise(jurisdiction.code)
        : null;
    }

    const replaces = statement.replacesStatements ? statement.replacesStatements : [];
    const nodeType =
      publicListing?.hasPublicListing !== true || recordDetails?.publicListing?.hasPublicListing !== true
        ? recordDetails?.entityType.type || entityType
        : 'registeredEntityListed';
    return {
      id: statementId || statementID,
      statementDate,
      recordId,
      label: generateNodeLabel(recordDetails?.name || name || ''),
      labelType: 'svg',
      class: entityType,
      nodeType: iconType(nodeType),
      countryCode: countryCode,
      config: nodeConfig,
      replaces: replaces,
    };
  });

  return latest(mappedData, closedRecords, version);
};

export const setUnknownNode = (source) => unknownNode(source);

export const getNodes = (data, edges) => {
  const personNodes = getPersonNodes(data);
  const entityNodes = getEntityNodes(data);

  // Some of the edges have unknown sources then we map these to an inserted unknown node
  const unknownSubjects = edges.filter((edge, index) => {
    edge.source = edge.source === 'unknown' ? `unknown${index}` : edge.source;
    return edge.source === `unknown${index}`;
  });
  const unknownNodes = unknownSubjects.map((unknownSubject) => {
    return setUnknownNode(unknownSubject.source);
  });

  return { nodes: [...personNodes, ...entityNodes, ...getPersonNodes(unknownNodes)] };
};

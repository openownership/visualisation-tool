// import generateNodeLabel from './nodeSVGLabel';
import generateNodeLabel from './nodeHTMLLabel';

const unknownNode = [
  {
    statementID: 'unknown',
    statementType: 'personStatement',
    names: [{ fullName: 'Unknown' }],
  },
];

const nodeConfig = {
  shape: 'circle',
  width: 100,
  style: 'opacity: 0; fill: #f7f7f7; stroke: #444; stroke-width: 1px;',
};

export const getPersonNodes = (bodsData) => {
  return bodsData
    .filter((statement) => statement.statementType === 'personStatement')
    .map((statement) => {
      const { statementID, names, nationalities = null } = statement;
      const nodeType = statementID === 'unknown' ? 'unknown' : 'person';
      const countryCode = nationalities ? nationalities[0].code : null
      return {
        id: statementID,
        label: generateNodeLabel(nodeType, names[0].fullName, countryCode),
        labelType: 'html',
        class: nodeType,
        config: nodeConfig,
      };
    });
};

export const getEntityNodes = (bodsData) => {
  return bodsData
    .filter((statement) => statement.statementType === 'entityStatement')
    .map((statement) => {
      const { statementID, name, incorporatedInJurisdiction = null } = statement;
      const countryCode = incorporatedInJurisdiction ? incorporatedInJurisdiction.code : null;
      return {
        id: statementID,
        label: generateNodeLabel('entity', name, countryCode),
        labelType: 'html',
        class: 'entity',
        config: nodeConfig,
      };
    });
};

export const setUnknownNode = () => getPersonNodes(unknownNode);

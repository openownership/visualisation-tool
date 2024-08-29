import dagreD3 from 'dagre-d3';

export const setupGraph = (rankDir) => {
  const g = new dagreD3.graphlib.Graph({});
  g.setGraph({
    rankdir: rankDir,
    nodesep: 200,
    edgesep: 25,
    ranksep: 300,
  });

  // Create the renderer
  const render = new dagreD3.render();

  return {
    g,
    render,
  };
};

export const setNodes = (nodes, g) => {
  nodes.forEach((node) => {
    g.setNode(node.recordId || node.id, {
      id: node.recordId || node.id,
      label: node.label,
      class: node.class || '',
      labelType: node.labelType || 'string',
      nodeType: node.nodeType,
      countryCode: node.countryCode,
      description: node.description,
      ...node.config,
    });
  });
};

export const setEdges = (edges, g) => {
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target, {
      id: edge.recordId || edge.id,
      class: edge.class || '',
      edgeType: edge.interestRelationship,
      description: edge.description,
      ...edge.config,
    });
  });
};

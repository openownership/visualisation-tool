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
    g.setNode(node.id, {
      label: node.label,
      class: node.class || '',
      labelType: node.labelType || 'string',
      nodeType: node.nodeType,
      countryCode: node.countryCode,
      ...node.config,
    });
  });
};

export const setEdges = (edges, g) => {
  edges.forEach((edge) =>
    g.setEdge(edge.source, edge.target, {
      class: edge.class || '',
      edgeType: edge.interestRelationship,
      ...edge.config,
    })
  );
};

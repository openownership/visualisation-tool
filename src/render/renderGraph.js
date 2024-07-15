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

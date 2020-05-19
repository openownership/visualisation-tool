const generateEdgeLabel = (controlText, ownershipText) => {
  return `
    <div style="position: relative; width: 240px; text-align: center;">
        <div style="display: inline-block; left: -30px; position: relative;" class='left-label'>${controlText}</div>
        <div style="display: inline-block; position: relative;" class='right-label'>${ownershipText}</div>
        </div>
        `;
};

export default generateEdgeLabel;

const images = require.context('../images', true);

const generateNodeLabel = (nodeType, nodeText, countryCode) => {
  return `
    <div class='centred-label'>
      <div class="image-holder">
      <div class="node-glyph top-left">
      </div>
      <div class="node-glyph top-right">
        ${countryCode ? `<img class="node-flag" src="${images("./flags/" + countryCode + ".svg", true)}"/>` : ''}
        </div>
        <div class="node-glyph bottom-left"></div>
        <div class="node-glyph bottom-right"></div>
        <img class="node-image" src="${images("./" + nodeType + ".svg", true)}"></img><br>
      </div>
      <div class="node-label wrap-text">
        ${nodeText}
      </div>
    </div>
    `;
};

export default generateNodeLabel;

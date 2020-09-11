import sanitise from '../utils/sanitiser';

const generateNodeLabel = (nodeType, nodeText, countryCode, imagesPath) => {
  return `
    <div class='centred-label'>
      <div class="image-holder">
      <div class="node-glyph top-left">
      </div>
      <div class="node-glyph top-right">
        ${
          countryCode ? `<img class="node-flag" src="${imagesPath}/flags/${sanitise(countryCode)}.svg"/>` : ''
        }
        </div>
        <div class="node-glyph bottom-left"></div>
        <div class="node-glyph bottom-right"></div>
        <img class="node-image" src="${imagesPath}/${sanitise(nodeType)}.svg"/>
        <br>
      </div>
      <div class="node-label wrap-text">
        ${sanitise(nodeText)}
      </div>
    </div>
    `;
};

export default generateNodeLabel;

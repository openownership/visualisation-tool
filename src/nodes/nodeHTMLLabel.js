const generateNodeLabel = (nodeType, nodeText, jurisdiction) => {
  const countryCode = jurisdiction ? jurisdiction.code : null;
  return `
    <div class='centred-label'>
        <div class="image-holder">
            <div class="node-glyph top-left">
                ${countryCode ? `<img class="node-flag" src="public/assets/flags/${countryCode}.svg"/>` : ''}
            </div>
            <div class="node-glyph top-right"></div>
            <div class="node-glyph bottom-left"></div>
            <div class="node-glyph bottom-right"></div>
            <img class="node-image" src="public/assets/${nodeType}.svg"></img><br>
        </div>
        <div class="node-label wrap-text">
            ${nodeText}
        </div>
    </div>
    `;
};

export default generateNodeLabel;

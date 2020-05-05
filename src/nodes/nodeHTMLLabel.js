const generateNodeLabel = (nodeType, nodeText) => {
    return `
    <div class='centred-label'>
        <div class="image-holder">
            <div class="node-glyph top-left"></div>
            <div class="node-glyph top-right"></div>
            <div class="node-glyph bottom-left"></div>
            <div class="node-glyph bottom-right"></div>
            <img class="node-image" src="public/assets/${nodeType}.svg"></img><br>
        </div>
        <div class="node-label wrap-text">
            ${nodeText}
        </div>
    </div>
    `
};

export default generateNodeLabel;

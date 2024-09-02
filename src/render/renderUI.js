import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import { SvgSaver } from '../utils/svgsaver';

export const setupUI = (zoom, svg) => {
  const zoomInBtn = document.querySelector('#zoom_in');
  const zoomOutBtn = document.querySelector('#zoom_out');
  const downloadSVGBtn = document.querySelector('#download-svg');
  const downloadPNGBtn = document.querySelector('#download-png');
  const svgElement = document.querySelector('#bods-svg');

  const svgsaver = new SvgSaver();

  zoomInBtn.addEventListener('click', () => {
    zoom.scaleBy(svg.transition().duration(750), 1.2);
  });
  zoomInBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      zoom.scaleBy(svg.transition().duration(750), 1.2);
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    zoom.scaleBy(svg.transition().duration(750), 0.8);
  });
  zoomOutBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      zoom.scaleBy(svg.transition().duration(750), 0.8);
    }
  });

  downloadSVGBtn.addEventListener('click', () => {
    svgsaver.asSvg(svgElement, 'bods.svg');
  });
  downloadSVGBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      svgsaver.asSvg(svgElement, 'bods.svg');
    }
  });

  downloadPNGBtn.addEventListener('click', () => {
    svgsaver.asPng(svgElement, 'bods.png');
  });
  downloadPNGBtn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      svgsaver.asPng(svgElement, 'bods.png');
    }
  });
};

const getDescription = (description) => {
  // Extract identifiers from description and output text on newlines
  let identifiers = [];
  let identifiersOutput = '';
  if (typeof description.identifiers !== 'undefined' && description.identifiers !== null) {
    identifiers = description.identifiers.map((identifier, index) => ({
      [`Identifier ${index + 1}`]: `(${identifier.scheme}) ${identifier.id}`,
    }));
    identifiers.forEach((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      identifiersOutput += `${key}: ${value}\n`;
    });
  }

  // Extract interests from description and output text on newlines
  let interests = [];
  let interestsOutput = '';
  if (typeof description.interests !== 'undefined' && description.interests !== null) {
    interests = description.interests.map((interest, index) => ({
      [`Interest ${index + 1} Type`]: `${interest.type}\n`,
      [`Interest ${index + 1} Start Date`]: `${interest.startDate}\n`,
    }));
    interests.forEach((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          interestsOutput += `${key}: ${item[key]}`;
        }
      }
    });
  }

  // Output the descriptions subset as key value pairs on new lines
  return `Statement date: ${description.statementDate}\nRecord ID: ${description.recordId}\n${
    identifiers.length > 0 ? identifiersOutput : ''
  }${interests.length > 0 ? interestsOutput : ''}`;
};

export const renderProperties = (inner, g, useTippy) => {
  const disclosureWidget = document.querySelector('#disclosure-widget');

  const nodes = inner.selectAll('g.node');
  nodes.each((d, i) => {
    const node = g.node(d);

    const description = getDescription(node.description);
    const fullDescription = JSON.stringify(node.fullDescription, null, 2);

    if (useTippy) {
      const tippyInstance = tippy(node.elem, {
        content: `<div class="button-container"><button id="close-tooltip">&times;</button></div><pre>${description}</pre>`,
        allowHTML: true,
        trigger: 'manual',
        hideOnClick: false,
        interactive: true,
        theme: 'light-border',
        appendTo: document.body,
        onShow: () => {
          disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;
        },
      });

      node.elem.addEventListener('click', () => {
        hideAll();
        tippyInstance.show();

        setTimeout(() => {
          document.getElementById('close-tooltip').addEventListener('click', () => {
            hideAll();
          });
        }, 0);
      });
    }
  });

  const edges = inner.selectAll('g.edgePath');
  edges.each((d, i) => {
    const edge = g.edge(d.v, d.w);

    const description = getDescription(edge.description);
    const fullDescription = JSON.stringify(edge.fullDescription, null, 2);

    if (useTippy) {
      const tippyInstance = tippy(edge.elem, {
        content: `<div class="button-container"><button id="close-tooltip">&times;</button></div><pre>${description}</pre>`,
        allowHTML: true,
        trigger: 'manual',
        hideOnClick: false,
        interactive: true,
        theme: 'light-border',
        appendTo: document.body,
        onShow: () => {
          disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;
        },
      });

      edge.elem.addEventListener('click', () => {
        hideAll();
        tippyInstance.show();

        setTimeout(() => {
          document.getElementById('close-tooltip').addEventListener('click', () => {
            hideAll();
          });
        }, 0);
      });
    }
  });
};

import { compareVersions } from 'compare-versions';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import { setZoomTransform } from './renderD3';
import { SvgSaver } from '../utils/svgsaver';

export const setupUI = (zoom, inner, svg) => {
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

  downloadSVGBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoomTransform(inner, svg);
    svgsaver.asSvg(svgElement, 'bods.svg');
  });
  downloadSVGBtn.addEventListener('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === 'Space') {
      setZoomTransform(inner, svg);
      svgsaver.asSvg(svgElement, 'bods.svg');
    }
  });

  downloadPNGBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setZoomTransform(inner, svg);
    svgsaver.asPng(svgElement, 'bods.png');
  });
  downloadPNGBtn.addEventListener('keyup', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.key === 'Space') {
      setZoomTransform(inner, svg);
      svgsaver.asPng(svgElement, 'bods.png');
    }
  });
};

const getDescription = (description) => {
  // Extract identifiers from description and output text on newlines
  let identifiers = [];
  let identifiersOutput = '';
  if (description.identifiers) {
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
  if (description.interests) {
    interests = description.interests.map((interest, index) => {
      if (interest.startDate) {
        return {
          [`Interest ${index + 1} Type`]: `${interest.type}\n`,
          [`Interest ${index + 1} Start Date`]: `${interest.startDate}\n`,
        };
      } else {
        return {
          [`Interest ${index + 1} Type`]: `${interest.type}\n`,
        };
      }
    });
    interests.forEach((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          interestsOutput += `${key}: ${item[key]}`;
        }
      }
    });
  }

  // Output the descriptions subset as key value pairs on new lines
  return `Statement date: ${description.statementDate}\n${
    description.recordId !== null ? 'Record ID: ' + description.recordId + '\n' : ''
  }${identifiers.length > 0 ? identifiersOutput : ''}${interests.length > 0 ? interestsOutput : ''}`;
};

// Configure tippy.js
const setTippyInstance = (element, content) => {
  return tippy(element, {
    content: `<div class="button-container"><button class="close-tooltip">&times;</button></div><pre>${content}</pre>`,
    allowHTML: true,
    trigger: 'manual',
    hideOnClick: false,
    interactive: true,
    theme: 'light-border',
    appendTo: document.body,
  });
};

//  Generic function to check if elements (multiple) exist in the DOM
function waitForElementsToExist(selector, callback) {
  if (document.querySelectorAll(selector)) {
    return callback(document.querySelectorAll(selector));
  }

  const intervalId = setInterval(() => {
    if (document.querySelectorAll(selector)) {
      clearInterval(intervalId);
      callback(document.querySelectorAll(selector));
    }
  }, 500);
}

export const renderMessage = (message) => {
  alert(message);
};

export const renderProperties = (inner, g, useTippy) => {
  const disclosureWidget = document.querySelector('#disclosure-widget');

  const nodes = inner.selectAll('g.node');
  nodes.each((d, i) => {
    const node = g.node(d);
    // Don't display statement properties if the node is unspecified
    if (node?.class?.includes('unknown') || node?.class?.includes('unspecified')) {
      return;
    }
    const description = getDescription(node.description);
    const fullDescription = JSON.stringify(node.fullDescription, null, 2);

    node.elem.addEventListener('click', () => {
      // Populate disclosure widget with node `fullDescription` JSON
      disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;

      // Only use tippy.js if the useTippy property is true
      if (useTippy) {
        // Pre-emptively hide any rogue open tooltips
        hideAll();

        // Create tooltip instance and display it
        const tippyInstance = setTippyInstance(node.elem, description);
        tippyInstance.show();

        // Wait until the tooltip button exists before attaching a close event
        waitForElementsToExist('.close-tooltip', (elements) => {
          elements.forEach((element) => {
            element.addEventListener('click', () => {
              hideAll();
            });
          });
        });
      }
    });
  });

  const edges = inner.selectAll('g.edgePath');
  edges.each((d, i) => {
    const edge = g.edge(d.v, d.w);
    const edgeInstances = document.querySelectorAll(`#${edge.elem.id}`);
    const description = getDescription(edge.description);
    const fullDescription = JSON.stringify(edge.fullDescription, null, 2);

    edgeInstances.forEach((edgeInstance) => {
      edgeInstance.addEventListener('click', () => {
        // Populate disclosure widget with edge `fullDescription` JSON
        disclosureWidget.innerHTML = `<details open><summary>Properties</summary><pre>${fullDescription}</pre></details>`;

        // Only use tippy.js if the useTippy property is true
        if (useTippy) {
          // Pre-emptively hide any rogue open tooltips
          hideAll();

          // Create tooltip instance and display it
          const tippyInstance = setTippyInstance(edgeInstance, description);
          tippyInstance.show();

          // Wait until the tooltip button exists before attaching a close event
          waitForElementsToExist('.close-tooltip', (elements) => {
            elements.forEach((element) => {
              element.addEventListener('click', () => {
                hideAll();
              });
            });
          });
        }
      });
    });
  });
};

export const renderDateSlider = (dates, version, currentlySelectedDate) => {
  const sliderContainer = document.querySelector('#slider-container');
  let selectedDate = currentlySelectedDate ? currentlySelectedDate : dates[dates.length - 1];
  if (compareVersions(version, '0.4') >= 0 && dates.length) {
    sliderContainer.style.display = 'block';
    sliderContainer.innerHTML = `
      <input id="slider-input" type="range" min="0" max="${dates.length - 1}" list="markers" step="1"></input>
      <datalist id="markers">
      </datalist>
      <p>Date: <output id="slider-value"></output></p>
      <button id="apply-date-btn">Apply</button>
    `;
    const datalist = document.querySelector('#markers');

    for (let i = 0; i < dates.length; i++) {
      datalist.innerHTML += `
        <option value="${i}"></option>
      `;
    }

    const value = document.querySelector('#slider-value');
    const input = document.querySelector('#slider-input');
    input.value = currentlySelectedDate ? dates.indexOf(currentlySelectedDate) : dates.length - 1;
    value.textContent = dates[input.value];
    input.addEventListener('input', (event) => {
      value.textContent = dates[event.target.value];
      selectedDate = dates[event.target.value];
    });
    return selectedDate;
  } else if (compareVersions(version, '0.4') <= 0 && dates.length) {
    sliderContainer.style.display = 'block';
    sliderContainer.innerHTML = `
      <input id="slider-input" type="range" disabled min="0" max="1"></input>
      <p>Date: <output id="slider-value">${dates[dates.length - 1]}</output></p>
    `;
    const input = document.querySelector('#slider-input');
    input.value = 1;
  } else {
    sliderContainer.style.display = 'none';
  }
};

// Show/Hide helpers from https://plainjs.com/javascript/effects/hide-or-show-an-element-42/
// get the default display style of an element
const defaultDisplay = (tag) => {
  var iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', 0);
  iframe.setAttribute('width', 0);
  iframe.setAttribute('height', 0);
  document.documentElement.appendChild(iframe);

  var doc = (iframe.contentWindow || iframe.contentDocument).document;

  // IE support
  doc.write();
  doc.close();

  var testEl = doc.createElement(tag);
  doc.documentElement.appendChild(testEl);
  var display = (window.getComputedStyle ? getComputedStyle(testEl, null) : testEl.currentStyle).display
  iframe.parentNode.removeChild(iframe);
  return display;
}

// actual show/hide function used by show() and hide() below
const showHide = (el, show) => {
  var value = el.getAttribute('data-olddisplay'),
    display = el.style.display,
    computedDisplay = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle).display;

  if (show) {
    if (!value && display === 'none') el.style.display = '';
    if (el.style.display === '' && (computedDisplay === 'none')) value = value || defaultDisplay(el.nodeName);
  } else {
    if (display && display !== 'none' || !(computedDisplay == 'none'))
      el.setAttribute('data-olddisplay', (computedDisplay == 'none') ? display : computedDisplay);
  }
  if (!show || el.style.display === 'none' || el.style.display === '')
    el.style.display = show ? value || '' : 'none';
}

// helper functions
const show = (el) => {
  showHide(el, true);
}

const hide = (el) => {
  showHide(el);
}

export { show, hide, showHide, defaultDisplay }
export default (string) => {
  // Convert non-string values to strings before sanitising
  const coercedString = string.toString();
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/gi;
  return coercedString.replace(reg, (match) => map[match]);
};

/* global PrismLanguages */

PrismLanguages.add({'<<type>>': '<<typePrism>>'});

/* global Panels */

Panels.add({
  'id': 'sg-panel-<<type>>',
  'name': '<<typeUC>>',
  'default': false,
  'templateID': 'pl-panel-template-code',
  'httpRequest': true,
  'httpRequestReplace': '.<<type>>',
  'httpRequestCompleted': false,
  'prismHighlight': true,
  'language': '<<type>>',
  'keyCombo': 'ctrl+shift+z'
});

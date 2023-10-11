const path = require('path');
const { isPathRelative } = require('../helpers');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "description",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias ?? '';

    const checkingLayers = {
      'entities': 'entities',
      'features': 'features',
      'widgets': 'widgets',
      'pages': 'pages',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if(isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/');

        const isImportNotFromPublicApi = segments.length > 2;

        const layer = segments[0];

        if(!checkingLayers[layer]) {
          return;
        }

        if(isImportNotFromPublicApi) {
          context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)')
        }
      }
    };
  },

};

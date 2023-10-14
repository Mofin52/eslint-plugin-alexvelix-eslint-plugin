const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

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
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const {alias = '', testFilesPatterns = []} = context.options[0] || {};

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
        const isTestingPulbicApi = segments[2] === 'testing' && segments.length < 4;

        const layer = segments[0];

        if(!checkingLayers[layer]) {
          return;
        }

        if(isImportNotFromPublicApi && !isTestingPulbicApi) {
          context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)')
        }

        if(isTestingPulbicApi) {
          const currentFilePath = context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.some(pattern => micromatch.isMatch(currentFilePath, pattern));

          if(!isCurrentFileTesting) {
            context.report(node, 'Тестовые данные необходимо импортировать из publicApi/testing.ts')
          }
        }
      }
    };
  },

};

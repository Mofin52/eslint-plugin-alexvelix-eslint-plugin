/**
 * @fileoverview description
 * @author Alexander
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


const aliasOptions = [{
  alias: '@'
}];

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

ruleTester.run("public-api-imports", rule, {
  valid: [
    {code: "import { someThing } from '../../model/slices/someFile.ts'", errors: []},
    {code: "import { someThing } from '@/entities/Article'", errors: [], options: aliasOptions}
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "import { someThing } from '@/entities/Article/model/slices/someFile.ts'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)" }],
      options: aliasOptions
    },
  ],
});

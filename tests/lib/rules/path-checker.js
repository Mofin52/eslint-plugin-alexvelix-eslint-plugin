/**
 * @fileoverview feature sliced relative path checker
 * @author Alex Velix
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: 'some/project/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slice/addCommentFormSlice'",
    },
  ],

  invalid: [
    {
      filename: 'some/project/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slice/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
    },
    {
      filename: 'some/project/src/entities/Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slice/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: [{
       alias: '@'
      }]
    },
  ],
});

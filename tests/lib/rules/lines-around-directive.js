/**
 * @fileoverview Enforce newlines between operands of ternary expressions
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/lines-around-directive");
const RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("lines-around-directive", rule, {
    valid: [

      // Uses "always by default
      "// comment\n\n'use strict';\n\nvar foo;",

      // "always"
      // at top of file
      { code: "'use strict';\n\nvar foo;", options: ["always"] },
      { code: "'use strict';\n\n//comment", options: ["always"] },
      { code: "'use strict';\n\n/*comment*/", options: ["always"] },

      // after comment at top of file
      { code: "#!/usr/bin/env node\n\n'use strict';\n\nvar foo;", options: ["always"] },
      { code: "// comment\n\n'use strict';\n\nvar foo;", options: ["always"] },
      { code: "/*comment*/\n\n'use strict';\n\nvar foo;", options: ["always"] },
      { code: "/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;", options: ["always"] },

      // at the top of function blocks
      { code: "function foo() {\n'use strict';\n\nvar bar;\n}", options: ["always"] },
      { code: "function foo() {\n\n'use strict';\n\nvar bar;\n}", options: ["always"] },
      { code: "() => {\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["always"] },
      { code: "() => {\n\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["always"] },

      // is not affected by JSDoc comments when at top of function block
      { code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\n\nvar bar;\n}", options: ["always"] },

      // ignores if the directive is the only statement in the function block
      { code: "function foo() {\n'use strict';\n}", options: ["always"] },

      // after comment at top of function blocks
      { code: "function foo() {\n// comment\n\n'use strict';\n\nvar bar;\n}", options: ["always"] },
      { code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar bar;\n}", options: ["always"] },
      { code: "() => {\n// comment\n\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["always"] },
      { code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["always"] },


      // "never"
      // at top of file
      { code: "'use strict';\nvar foo;", options: ["never"] },
      { code: "'use strict';\n//comment", options: ["never"] },
      { code: "'use strict';\n/*comment*/", options: ["never"] },

      // after comment at top of file
      { code: "#!/usr/bin/env node\n'use strict';\nvar foo;", options: ["never"] },
      { code: "// comment\n'use strict';\nvar foo;", options: ["never"] },
      { code: "/*comment*/\n'use strict';\nvar foo;", options: ["never"] },
      { code: "/*\nmultiline comment\n*/\n'use strict';\nvar foo;", options: ["never"] },

      // at the top of function blocks
      { code: "function foo() {\n'use strict';\nvar bar;\n}", options: ["never"] },
      { code: "function foo() {\n\n'use strict';\nvar bar;\n}", options: ["never"] },
      { code: "() => {\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
      { code: "() => {\n\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },

      // is not affected by JSDoc comments when at top of function block
      { code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\nvar bar;\n}", options: ["never"] },

      // does not throw if the directive is the only statement in the function block
      { code: "function foo() {\n'use strict';\n}", options: ["never"] },

      // after comment at top of function blocks
      { code: "function foo() {\n// comment\n'use strict';\nvar bar;\n}", options: ["never"] },
      { code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\nvar bar;\n}", options: ["never"] },
      { code: "() => {\n// comment\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },
      { code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: ["never"] },


      // { "after": "always", "before": "never" }
      // at top of file
      { code: "'use strict';\n\nvar foo;", options: [{ after: "always", before: "never" }] },
      { code: "'use strict';\n\n//comment", options: [{ after: "always", before: "never" }] },
      { code: "'use strict';\n\n/*comment*/", options: [{ after: "always", before: "never" }] },

      // after comment at top of file
      { code: "#!/usr/bin/env node\n'use strict';\n\nvar foo;", options: [{ after: "always", before: "never" }] },
      { code: "// comment\n'use strict';\n\nvar foo;", options: [{ after: "always", before: "never" }] },
      { code: "/*comment*/\n'use strict';\n\nvar foo;", options: [{ after: "always", before: "never" }] },
      { code: "/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;", options: [{ after: "always", before: "never" }] },

      // at the top of function blocks
      { code: "function foo() {\n'use strict';\n\nvar bar;\n}", options: [{ after: "always", before: "never" }] },
      { code: "function foo() {\n\n'use strict';\n\nvar bar;\n}", options: [{ after: "always", before: "never" }] },
      { code: "() => {\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "always", before: "never" }] },
      { code: "() => {\n\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "always", before: "never" }] },

      // is not affected by JSDoc comments when at top of function block
      { code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\n\nvar bar;\n}", options: [{ after: "always", before: "never" }] },

      // does not throw if the directive is the only statement in the function block
      { code: "function foo() {\n'use strict';\n}", options: [{ after: "always", before: "never" }] },

      // after comment at top of function blocks
      { code: "function foo() {\n// comment\n'use strict';\n\nvar bar;\n}", options: [{ after: "always", before: "never" }] },
      { code: "function foo() {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar bar;\n}", options: [{ after: "always", before: "never" }] },
      { code: "() => {\n// comment\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "always", before: "never" }] },
      { code: "() => {\n/*\nmultiline comment\n*/\n'use strict';\n\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "always", before: "never" }] },


      // { "after": "never", "before": "always" }
      // at top of file
      { code: "'use strict';\nvar foo;", options: [{ after: "never", before: "always" }] },
      { code: "'use strict';\n//comment", options: [{ after: "never", before: "always" }] },
      { code: "'use strict';\n/*comment*/", options: [{ after: "never", before: "always" }] },

      // after comment at top of file
      { code: "#!/usr/bin/env node\n\n'use strict';\nvar foo;", options: [{ after: "never", before: "always" }] },
      { code: "// comment\n\n'use strict';\nvar foo;", options: [{ after: "never", before: "always" }] },
      { code: "/*comment*/\n\n'use strict';\nvar foo;", options: [{ after: "never", before: "always" }] },
      { code: "/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;", options: [{ after: "never", before: "always" }] },

      // at the top of function blocks
      { code: "function foo() {\n'use strict';\nvar bar;\n}", options: [{ after: "never", before: "always" }] },
      { code: "function foo() {\n\n'use strict';\nvar bar;\n}", options: [{ after: "never", before: "always" }] },
      { code: "() => {\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "never", before: "always" }] },
      { code: "() => {\n\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "never", before: "always" }] },

      // is not affected by JSDoc comments when at top of function block
      { code: "/*\n * JSDoc comment\n */\nfunction foo() {\n'use strict';\nvar bar;\n}", options: [{ after: "never", before: "always" }] },

      // does not throw if the directive is the only statement in the function block
      { code: "function foo() {\n'use strict';\n}", options: [{ after: "never", before: "always" }] },

      // after comment at top of function blocks
      { code: "function foo() {\n// comment\n\n'use strict';\nvar bar;\n}", options: [{ after: "never", before: "always" }] },
      { code: "function foo() {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar bar;\n}", options: [{ after: "never", before: "always" }] },
      { code: "() => {\n// comment\n\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "never", before: "always" }] },
      { code: "() => {\n/*\nmultiline comment\n*/\n\n'use strict';\nvar foo;\n}", parserOptions: { ecmaVersion: 6 }, options: [{ after: "never", before: "always" }] },
    ],

    invalid: [
    ]
});

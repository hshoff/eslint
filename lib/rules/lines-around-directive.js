/**
 * @fileoverview Enforce or disallow newlines around directives
 * @author Kai Cataldo
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce or disallow newlines around directives",
            category: "Stylistic Issues",
            recommended: false
        },
        schema: [{
            oneOf: [
                {
                    enum: ["always", "never"]
                },
                {
                    type: "object",
                    properties: {
                        before: {
                            enum: ["always", "never"]
                        },
                        after: {
                            enum: ["always", "never"]
                        },
                    },
                    additionalProperties: false,
                    minProperties: 2
                }
            ]
        }]
    },

    create(context) {
        const sourceCode = context.getSourceCode();
        const config = context.options[0] || "always";
        const mode = generateMode(config);

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        /**
         * Generate rule mode from rule options configuration.
         * @param {object|string} config Configuration from rule options.
         * @returns {object} Represents whether or not rule should check "before" and "after".
         */
        function generateMode(config) {
            if (typeof config === "string") {
                return {
                  before: config,
                  after: config
                };
            } else if (typeof config === "object") {
                return {
                  before: config.before,
                  after: config.after
                };
            }
        }

        /**
         * Check if node is a 'use strict' directive.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} Whether or not the passed in node is a 'use strict' directive.
         */
        function isNodeUseStrictDirective(node) {
            return node.type === "ExpressionStatement" &&
              node.expression.type === "Literal" &&
              node.expression.value === "use strict";
        }

        /**
         * Get 'use strict' directive from node body.
         * @param {ASTNode[]} body Body of node to check.
         * @returns {boolean} Whether or not the passed in node is preceded by a blank newline.
         */
        function getUseStrictDirective(body) {
            const firstStatement = body[0];
            return isNodeUseStrictDirective(firstStatement) ? firstStatement : null;
        }

        /**
         * Check if node is preceded by a blank newline.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} Whether or not the passed in node is preceded by a blank newline.
         */
        function hasNewlineBefore(node, comments) {
            const comment = comments[comments.length - 1];
            return node.loc.start.line - comment.loc.end.line >= 2;
        }

        /**
         * Check if node is followed by a blank newline.
         * @param {ASTNode} node Node to check.
         * @returns {boolean} Whether or not the passed in node is followed by a blank newline.
         */
        function hasNewlineAfter(node) {
            const trailingComments = sourceCode.getComments(node).trailing;
            const tokenAfter = trailingComments.length ? trailingComments[0] : sourceCode.getTokenAfter(node);
            return tokenAfter.loc.start.line - node.loc.end.line >= 2;
        }

        /**
         * Report errors for newlines around directives.
         * @param {ASTNode} node Node to check.
         * @param {string} location Whether the error was found before or after the directive.
         * @param {boolean} expected Whether or not a newline was expected or unexpected.
         * @returns {void}
         */
        function reportError(node, location, expected) {
            context.report({
                node,
                message: "{{expected}} newline {{location}} 'use strict' directive.",
                data: {
                  expected: expected ? "Expected" : "Unexpected",
                  location
                }
            });
        }

        /**
         * Check lines around directives in node
         * @param {ASTNode} node - node to check
         * @returns {void}
         */
        function checkDirectives(node) {
            // Skip arrow functions with implicit return.
            // `() => "use strict";` returns the string "use strict".
            if (node.type === "ArrowFunctionExpression" && node.body.type !== "BlockStatement") {
                return;
            }

            const body = node.type === "Program" ? node.body : node.body.body;
            const directive = getUseStrictDirective(body);

            if (!directive) {
                return;
            }

            // Only check before if directive has leading comments
            const leadingComments = directive.leadingComments;
            if (leadingComments && leadingComments.length)  {
                if (mode.before === "always" && !hasNewlineBefore(directive, leadingComments)) {
                    reportError(directive, "before", true);
                }

                if (mode.before === "never" && hasNewlineBefore(directive, leadingComments)) {
                    reportError(directive, "before", false);
                }
            }

            // Do not check after if the directive is the last statement in the body of a Program or Function
            if (directive === body[body.length - 1]) {
                return;
            }

            if (mode.after === "always" && !hasNewlineAfter(directive)) {
                reportError(directive, "after", true);
            }

            if (mode.after === "never" && hasNewlineAfter(directive)) {
                reportError(directive, "after", false);
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: checkDirectives,
            FunctionDeclaration: checkDirectives,
            FunctionExpression: checkDirectives,
            ArrowFunctionExpression: checkDirectives
        };
    }
}

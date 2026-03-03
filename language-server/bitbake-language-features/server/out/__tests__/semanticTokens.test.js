"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const semanticTokens_1 = require("../semanticTokens");
const fixtures_1 = require("./fixtures/fixtures");
describe('Semantic tokens', () => {
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    beforeEach(() => {
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    it('gives approriate semantic tokens to symbols', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.SEMANTIC_TOKENS
        });
        const result = (0, semanticTokens_1.getParsedTokens)(fixtures_1.DUMMY_URI);
        expect(result).toEqual([
            {
                line: 0,
                startCharacter: 0,
                length: 3,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.variable,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.declaration]
            },
            {
                length: 5,
                line: 2,
                startCharacter: 0,
                tokenModifiers: ['declaration'],
                tokenType: 'variable'
            },
            {
                length: 6,
                line: 2,
                startCharacter: 6,
                tokenModifiers: [],
                tokenType: 'keyword'
            },
            {
                line: 2,
                startCharacter: 13,
                length: 10,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.operator,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.readonly]
            },
            {
                line: 2,
                startCharacter: 29,
                length: 3,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.variable,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.declaration]
            },
            {
                line: 4,
                startCharacter: 0,
                length: 8,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.function,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.declaration]
            },
            {
                line: 5,
                startCharacter: 4,
                length: 3,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.variable,
                tokenModifiers: []
            },
            {
                line: 5,
                startCharacter: 10,
                length: 3,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.variable,
                tokenModifiers: []
            },
            {
                line: 5,
                startCharacter: 16,
                length: 3,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.variable,
                tokenModifiers: []
            },
            {
                line: 6,
                startCharacter: 4,
                length: 8,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.function,
                tokenModifiers: []
            },
            {
                line: 9,
                startCharacter: 7,
                length: 5,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.function,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.declaration]
            },
            {
                line: 13,
                startCharacter: 4,
                length: 6,
                tokenType: semanticTokens_1.TOKEN_LEGEND.types.function,
                tokenModifiers: [semanticTokens_1.TOKEN_LEGEND.modifiers.declaration]
            }
        ]);
    });
});
//# sourceMappingURL=semanticTokens.test.js.map
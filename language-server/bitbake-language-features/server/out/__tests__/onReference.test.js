"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const onReference_1 = require("../connectionHandlers/onReference");
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const fixtures_1 = require("./fixtures/fixtures");
const BitbakeProjectScannerClient_1 = require("../BitbakeProjectScannerClient");
const path_1 = __importDefault(require("path"));
describe('onReferenceHandler', () => {
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
    it('should return all possible references on a valid symbol', () => {
        const document = fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE;
        const parsedBarPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAR_INC.uri.replace('file://', ''));
        const parsedFooPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.FOO_INC.uri.replace('file://', ''));
        const parsedBazPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAZ_BBCLASS.uri.replace('file://', ''));
        const parsedBitbakeConfPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BITBAKE_CONF.uri.replace('file://', ''));
        BitbakeProjectScannerClient_1.bitBakeProjectScannerClient.bitbakeScanResult = {
            _classes: [
                {
                    name: parsedBazPath.name,
                    path: parsedBazPath,
                    extraInfo: 'layer: core'
                }
            ],
            _includes: [
                {
                    name: parsedBarPath.name,
                    path: parsedBarPath,
                    extraInfo: 'layer: core'
                },
                {
                    name: parsedFooPath.name,
                    path: parsedFooPath,
                    extraInfo: 'layer: core'
                }
            ],
            _confFiles: [
                {
                    name: parsedBitbakeConfPath.name,
                    path: parsedBitbakeConfPath,
                    extraInfo: 'layer: core'
                }
            ]
        };
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document
        });
        const referenceParams = {
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 6,
                character: 15
            },
            context: {
                includeDeclaration: true
            }
        };
        const result = (0, onReference_1.onReferenceHandler)(referenceParams);
        expect(result).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 4,
                        character: 0
                    },
                    end: {
                        line: 4,
                        character: 6
                    }
                }
            },
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 5,
                        character: 0
                    },
                    end: {
                        line: 5,
                        character: 6
                    }
                }
            },
            {
                uri: fixtures_1.FIXTURE_URI.FOO_INC,
                range: {
                    start: {
                        line: 1,
                        character: 0
                    },
                    end: {
                        line: 1,
                        character: 6
                    }
                }
            },
            {
                uri: fixtures_1.FIXTURE_URI.FOO_INC,
                range: {
                    start: {
                        line: 2,
                        character: 0
                    },
                    end: {
                        line: 2,
                        character: 6
                    }
                }
            },
            {
                uri: fixtures_1.FIXTURE_URI.BAR_INC,
                range: {
                    start: {
                        line: 2,
                        character: 0
                    },
                    end: {
                        line: 2,
                        character: 6
                    }
                }
            },
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 6,
                        character: 9
                    },
                    end: {
                        line: 6,
                        character: 15
                    }
                }
            }
        ]));
    });
});
//# sourceMappingURL=onReference.test.js.map
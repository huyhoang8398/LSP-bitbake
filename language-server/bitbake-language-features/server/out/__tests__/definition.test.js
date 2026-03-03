"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const onDefinition_1 = require("../connectionHandlers/onDefinition");
const fixtures_1 = require("./fixtures/fixtures");
const path_1 = __importDefault(require("path"));
const BitbakeProjectScannerClient_1 = require("../BitbakeProjectScannerClient");
const files_1 = require("../lib/src/utils/files");
describe('on definition', () => {
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
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('provides go-to-definition to directive statement', async () => {
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
            ],
        };
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.FIXTURE_URI.DIRECTIVE,
            document: fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE
        });
        const definition = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE
            },
            position: {
                line: 2,
                character: 9
            }
        });
        const definition2 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE
            },
            position: {
                line: 3,
                character: 9
            }
        });
        // inherit_defer
        const definition4 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE
            },
            position: {
                line: 34,
                character: 15
            }
        });
        // Resolve the directive path with ${} and provide go-to-definition
        const scanResults = '#INCLUDE HISTORY\r\n#some operation history for PN\r\nPN = \'foo\'\r\n';
        analyzer_1.analyzer.processRecipeScanResults(scanResults, (0, files_1.extractRecipeName)(fixtures_1.FIXTURE_URI.DIRECTIVE));
        const definition3 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE
            },
            position: {
                line: 30,
                character: 9
            }
        });
        expect(definition).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.FIXTURE_URI.BAZ_BBCLASS,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }
        ]));
        expect(definition).toEqual(definition4);
        expect(definition2).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.FIXTURE_URI.BITBAKE_CONF,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }
        ]));
        expect(definition3).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.FIXTURE_URI.FOO_INC,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }
        ]));
    });
    it('provides go to definition for variables found in current file and included files', async () => {
        const parsedBazPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAZ_BBCLASS.uri.replace('file://', ''));
        const parsedFooPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.FOO_INC.uri.replace('file://', ''));
        const parsedBarPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAR_INC.uri.replace('file://', ''));
        BitbakeProjectScannerClient_1.bitBakeProjectScannerClient.bitbakeScanResult = {
            _layers: [],
            _overrides: [],
            _classes: [{
                    name: parsedBazPath.name,
                    path: parsedBazPath,
                    extraInfo: 'layer: core'
                }],
            _recipes: [],
            _confFiles: [],
            _includes: [
                {
                    name: parsedFooPath.name,
                    path: parsedFooPath,
                    extraInfo: 'layer: core'
                },
                {
                    name: parsedBarPath.name,
                    path: parsedBarPath,
                    extraInfo: 'layer: core'
                }
            ]
        };
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE
        });
        const result1 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 4,
                character: 1
            }
        });
        // Go to definition for symbols in variable expansion
        const result2 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 6,
                character: 11
            }
        });
        if (result1 === null) {
            fail('result1 is null');
        }
        expect(result1).toEqual(result2);
        expect(result1).toEqual(expect.arrayContaining([
            { uri: fixtures_1.FIXTURE_URI.FOO_INC, range: { start: { line: 1, character: 0 }, end: { line: 1, character: 6 } } },
            { uri: fixtures_1.FIXTURE_URI.FOO_INC, range: { start: { line: 2, character: 0 }, end: { line: 2, character: 6 } } }, { uri: fixtures_1.FIXTURE_URI.BAR_INC, range: { start: { line: 2, character: 0 }, end: { line: 2, character: 6 } } },
            { uri: fixtures_1.DUMMY_URI, range: { start: { line: 4, character: 0 }, end: { line: 4, character: 6 } } },
            { uri: fixtures_1.DUMMY_URI, range: { start: { line: 5, character: 0 }, end: { line: 5, character: 6 } } }
        ]));
    });
    it('provides go to definition for symbols found in the string content', async () => {
        const parsedHoverPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.HOVER.uri.replace('file://', ''));
        const somePackagePath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.HOVER.uri.replace('file://', '').replace('hover.bb', 'some-package.bb'));
        const somePackagePath2 = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.HOVER.uri.replace('file://', '').replace('hover.bb', 'some-package+1.inc'));
        const somePackagePath3 = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.HOVER.uri.replace('file://', '').replace('hover.bb', 'some-package-2.0.bb'));
        BitbakeProjectScannerClient_1.bitBakeProjectScannerClient.bitbakeScanResult._recipes = [
            {
                name: parsedHoverPath.name,
                path: parsedHoverPath,
                appends: [
                    {
                        root: parsedHoverPath.root,
                        dir: parsedHoverPath.dir,
                        base: 'hover-append.bbappend',
                        ext: 'bbappend',
                        name: 'hover-append'
                    }
                ],
                extraInfo: 'layer: core'
            },
            {
                name: somePackagePath.name,
                path: somePackagePath,
                extraInfo: 'layer: core'
            },
            {
                name: somePackagePath2.name,
                path: somePackagePath2,
                extraInfo: 'layer: core'
            },
            {
                name: somePackagePath3.name,
                path: somePackagePath3,
                extraInfo: 'layer: core'
            }
        ];
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE
        });
        const shouldWork1 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 7,
                character: 21
            }
        });
        const shouldWork2 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 8,
                character: 22
            }
        });
        const shouldWork3 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 9,
                character: 14
            }
        });
        const shouldWork4 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 26,
                character: 20
            }
        });
        const shouldWork5 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 28,
                character: 42
            }
        });
        const shouldWork6 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 28,
                character: 65
            }
        });
        const shouldWork7 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 28,
                character: 78
            }
        });
        const shouldWork8 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 26,
                character: 33
            }
        });
        const shouldNotWork = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 9,
                character: 31
            }
        });
        expect(shouldWork1).toEqual([
            {
                uri: fixtures_1.FIXTURE_URI.HOVER,
                range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
            },
            { range: { end: { character: 0, line: 0 }, start: { character: 0, line: 0 } }, uri: 'file://' + parsedHoverPath.dir + '/hover-append.bbappend' }
        ]);
        expect(shouldWork2).toEqual(shouldWork1);
        expect(shouldWork3).toEqual(shouldWork1);
        expect(shouldWork4).toEqual([{
                uri: 'file://' + somePackagePath.dir + '/some-package.bb',
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }]);
        expect(shouldWork5).toEqual(shouldWork4);
        expect(shouldWork6).toEqual(shouldWork4);
        expect(shouldWork7).toEqual([{
                uri: 'file://' + somePackagePath2.dir + '/some-package+1.inc',
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }]);
        expect(shouldWork8).toEqual([{
                uri: 'file://' + somePackagePath3.dir + '/some-package-2.0.bb',
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }]);
        expect(shouldNotWork).toEqual([]);
    });
    it('provides additional go to definition after the processed scan results are available', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.CORRECT
        });
        const fakeFilePath = fixtures_1.FIXTURE_URI.BAR_INC.replace('file://', '');
        const fakeLineNumber = 1;
        const variable = 'FINAL_VALUE';
        const funcName = 'do_build';
        const scanResults = `#INCLUDE HISTORY\r\n#   set ${fakeFilePath}:${fakeLineNumber}\r\n${variable} = 'this is the final value for FINAL_VALUE'\r\n${variable}:o1 = 'this is the final value for FINAL_VALUE with override o1'\r\n`;
        analyzer_1.analyzer.processRecipeScanResults(scanResults, (0, files_1.extractRecipeName)(fixtures_1.DUMMY_URI));
        const shouldWork = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 9,
                character: 1
            }
        });
        expect(shouldWork).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 9,
                        character: 0
                    },
                    end: {
                        line: 9,
                        character: 11
                    }
                }
            },
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 10,
                        character: 0
                    },
                    end: {
                        line: 10,
                        character: 11
                    }
                }
            },
            {
                uri: fixtures_1.FIXTURE_URI.BAR_INC,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 11
                    }
                }
            }
        ]));
        // Functions
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.FIXTURE_URI.DIRECTIVE,
            document: fixtures_1.FIXTURE_DOCUMENT.BAR_INC
        });
        const scanResults2 = `#INCLUDE HISTORY\n# line: ${fakeLineNumber}, file: ${fakeFilePath}\n${funcName}(){\n\techo '123'\n}`;
        analyzer_1.analyzer.processRecipeScanResults(scanResults2, (0, files_1.extractRecipeName)(fixtures_1.FIXTURE_URI.DIRECTIVE));
        const shouldWork2 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE
            },
            position: {
                line: 6,
                character: 1
            }
        });
        expect(shouldWork2).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.FIXTURE_URI.DIRECTIVE, // symbol itself
                range: {
                    start: {
                        line: 6,
                        character: 0
                    },
                    end: {
                        line: 6,
                        character: 8
                    }
                }
            },
            {
                uri: 'file://' + fakeFilePath, // symbol from the scan result
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 8
                    }
                }
            }
        ]));
    });
    it('provides go to definition for overrides', async () => {
        const parsedConfFile = path_1.default.parse('/home/poky/layer/poky.conf');
        const parsedConfFile2 = '/home/poky/layer-accurate/poky.conf';
        BitbakeProjectScannerClient_1.bitBakeProjectScannerClient.bitbakeScanResult._confFiles = [
            {
                name: parsedConfFile.name,
                path: parsedConfFile,
                extraInfo: 'layer: core'
            }
        ];
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE
        });
        const shouldWork = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 32,
                character: 5
            }
        });
        expect(shouldWork).toEqual(expect.arrayContaining([
            {
                uri: 'file://' + parsedConfFile.dir + '/' + parsedConfFile.base,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }
        ]));
        // when recipe scan result is avaiable, prioritize the path found in the result
        const scanResults = `#  INCLUDE HISTORY\r\n#\r\n# ${parsedConfFile2}\r\n`;
        analyzer_1.analyzer.processRecipeScanResults(scanResults, (0, files_1.extractRecipeName)(fixtures_1.DUMMY_URI));
        const shouldWork2 = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 32,
                character: 5
            }
        });
        expect(shouldWork2).toEqual(expect.arrayContaining([
            {
                uri: 'file://' + parsedConfFile2,
                range: {
                    start: {
                        line: 0,
                        character: 0
                    },
                    end: {
                        line: 0,
                        character: 0
                    }
                }
            }
        ]));
    });
    it('only provides symbols in declaration expression as definitions', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldWork = await (0, onDefinition_1.onDefinitionHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 1,
                character: 1
            }
        });
        expect(shouldWork).toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 1,
                        character: 0
                    },
                    end: {
                        line: 1,
                        character: 11
                    }
                }
            }
        ]));
        // Symbols with the same identifier but with different kind or the ones in ${} should not be definitions
        // Function -> Function
        // Variable -> Variable
        expect(shouldWork).not.toEqual(expect.arrayContaining([
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 4,
                        character: 7
                    },
                    end: {
                        line: 4,
                        character: 18
                    }
                }
            },
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 2,
                        character: 11
                    },
                    end: {
                        line: 2,
                        character: 22
                    }
                }
            },
            {
                uri: fixtures_1.DUMMY_URI,
                range: {
                    start: {
                        line: 3,
                        character: 8
                    },
                    end: {
                        line: 3,
                        character: 19
                    }
                }
            }
        ]));
    });
});
//# sourceMappingURL=definition.test.js.map
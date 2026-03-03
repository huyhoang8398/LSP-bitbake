"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BitBakeDocScanner_1 = require("../BitBakeDocScanner");
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const fixtures_1 = require("./fixtures/fixtures");
const onHover_1 = require("../connectionHandlers/onHover");
const path_1 = __importDefault(require("path"));
const BitbakeProjectScannerClient_1 = require("../BitbakeProjectScannerClient");
const files_1 = require("../lib/src/utils/files");
describe('on hover', () => {
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
        BitBakeDocScanner_1.bitBakeDocScanner.clearScannedDocs();
    });
    it('shows definition on hovering variable in variable assignment syntax or in variable expansion syntax after scanning the docs', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseBitbakeVariablesFile();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 1,
                character: 1
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 2,
                character: 12
            }
        });
        const shouldShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 3,
                character: 9
            }
        });
        const shouldNotShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 4,
                character: 8
            }
        });
        const shouldNotShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 8,
                character: 47
            }
        });
        const shouldNotShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 10,
                character: 3
            }
        });
        expect(shouldShow1).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow2).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow3).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldNotShow1).toBe(null);
        expect(shouldNotShow2).toBe(null);
        expect(shouldNotShow3).toBe(null);
        // With Yocto variables present, the yocto variables should be shown in case of the duplicated variable names
        BitBakeDocScanner_1.bitBakeDocScanner.parseYoctoVariablesFile();
        const shouldShow4 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 1,
                character: 1
            }
        });
        expect(shouldShow4).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   The package description used by package managers. If not set,\n   `DESCRIPTION` takes the value of the `SUMMARY`\n   variable.\n\n'
            }
        });
    });
    it('should show hover definition for variable flags after scanning the docs', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseVariableFlagFile();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 12,
                character: 7
            }
        });
        const shouldNotShow = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 13,
                character: 9
            }
        });
        expect(shouldShow).toEqual({
            contents: {
                kind: 'markdown',
                value: '**cleandirs**\n___\n Empty directories that should be created before\n   the task runs. Directories that already exist are removed and\n   recreated to empty them.\n'
            }
        });
        expect(shouldNotShow).toBe(null);
    });
    it('should show hover definition for yocto tasks after scanning the docs', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseYoctoTaskFile();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 15,
                character: 2
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 19,
                character: 9
            }
        });
        const shouldShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 23,
                character: 6
            }
        });
        const shouldNotShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 26,
                character: 5
            }
        });
        const shouldNotShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 27,
                character: 13
            }
        });
        expect(shouldShow1).toEqual({
            contents: {
                kind: 'markdown',
                value: '**do_build**\n___\nThe default task for all recipes. This task depends on all other normal\ntasks required to build a recipe.\n'
            }
        });
        expect(shouldShow2).toEqual({
            contents: {
                kind: 'markdown',
                value: '**do_build**\n___\nThe default task for all recipes. This task depends on all other normal\ntasks required to build a recipe.\n'
            }
        });
        expect(shouldShow3).toEqual({
            contents: {
                kind: 'markdown',
                value: '**do_build**\n___\nThe default task for all recipes. This task depends on all other normal\ntasks required to build a recipe.\n'
            }
        });
        expect(shouldNotShow1).toBe(null);
        expect(shouldNotShow2).toBe(null);
    });
    it('should show hover definition for keywords', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 30,
                character: 1
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 31,
                character: 1
            }
        });
        const shouldShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 32,
                character: 1
            }
        });
        expect(shouldShow1).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('inherit')
            })
        }));
        expect(shouldShow2).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('include')
            })
        }));
        expect(shouldShow3).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('require')
            })
        }));
    });
    it('shows definition on hovering variable in Python functions for accessing datastore', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseBitbakeVariablesFile();
        BitBakeDocScanner_1.bitBakeDocScanner.parsePythonDatastoreFunction();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 35,
                character: 14
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 36,
                character: 14
            }
        });
        const shouldShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 37,
                character: 37
            }
        });
        const shouldShow4 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 41,
                character: 19
            }
        });
        const shouldShow5 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 47,
                character: 20
            }
        });
        const shouldShow6 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 45,
                character: 14
            }
        });
        const shouldNotShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 35,
                character: 33
            }
        });
        const shouldNotShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 38,
                character: 14
            }
        });
        const shouldNotShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 39,
                character: 12
            }
        });
        const shouldNotShow4 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 40,
                character: 19
            }
        });
        const shouldNotShow5 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 56,
                character: 10
            }
        });
        expect(shouldShow1).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow2).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow3).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow4).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow5).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldShow6).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldNotShow1).toBe(null);
        expect(shouldNotShow2).toBe(null);
        expect(shouldNotShow3).toBe(null);
        expect(shouldNotShow4).toBe(null);
        expect(shouldNotShow5).toBe(null);
    });
    it('shows definition on hovering variable expansion inside bash region', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseBitbakeVariablesFile();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 50,
                character: 9
            }
        });
        const shouldNotShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 50,
                character: 21
            }
        });
        expect(shouldShow1).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
        expect(shouldNotShow1).toBe(null);
    });
    it('shows definition on hovering simple variable expansion inside bash region', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseBitbakeVariablesFile();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 51,
                character: 9
            }
        });
        expect(shouldShow1).toEqual({
            contents: {
                kind: 'markdown',
                value: '**DESCRIPTION**\n___\n   A long description for the recipe.\n\n'
            }
        });
    });
    it('should show comments above the global declarations', async () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parseYoctoTaskFile();
        BitBakeDocScanner_1.bitBakeDocScanner.parseBitbakeVariablesFile();
        const parsedBarPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAR_INC.uri.replace('file://', ''));
        const parsedFooPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.FOO_INC.uri.replace('file://', ''));
        const parsedBazPath = path_1.default.parse(fixtures_1.FIXTURE_DOCUMENT.BAZ_BBCLASS.uri.replace('file://', ''));
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
            _layers: [],
            _overrides: [],
            _recipes: [],
            _confFiles: []
        };
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.DIRECTIVE
        });
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 14,
                character: 1
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 22,
                character: 1
            }
        });
        const shouldNotShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 12,
                character: 1
            }
        });
        const shouldNotShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 18,
                character: 1
            }
        });
        const DUMMY_URI_TRIMMED = fixtures_1.DUMMY_URI.replace('file://', '');
        // 1. should show all comments above the symbols that don't have docs from yocto/bitbake
        // 2. should show comments for all declarations for the same variable in the same file
        // 3. The higher priority comments replace the lower ones according to the order: .bbclass, .conf, .inc, .bb, .bbappend
        expect(shouldShow1).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: ` comment 1 for MYVAR in baz.bbclass\n\nSource: ${fixtures_1.FIXTURE_DOCUMENT.BAZ_BBCLASS.uri.replace('file://', '')} \`L: 4\``
            })
        }));
        // show comments for custom function
        expect(shouldShow2).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: ` comment 1 for my_func\n\nSource: ${DUMMY_URI_TRIMMED} \`L: 23\``
            })
        }));
        // Don't show comments for variables/tasks that already have docs from yocto/bitbake
        expect(shouldNotShow1).not.toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining(`comment 1 for my_func\n\nSource: ${DUMMY_URI_TRIMMED} \`L: 23\``)
            })
        }));
        expect(shouldNotShow2).not.toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining(`comment 1 for do_build\n\nSource: ${DUMMY_URI_TRIMMED} \`L: 19\``)
            })
        }));
    });
    it('should show final value of the variable after the scan results are available', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.CORRECT
        });
        const scanResults = '#INCLUDE HISTORY\n# Some scan results here\nFINAL_VALUE = \'this is the final value for FINAL_VALUE\'\nFINAL_VALUE:o1 = \'this is the final value for FINAL_VALUE with override o1\'\nFINAL_VALUE:o1:pn:pn-foo = \'this is the final value for FINAL_VALUE with override containing variable expansion\'\nPN= \'pn\'\n';
        analyzer_1.analyzer.processRecipeScanResults(scanResults, (0, files_1.extractRecipeName)(fixtures_1.DUMMY_URI));
        const shouldShow1 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 9,
                character: 1
            }
        });
        const shouldShow2 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 10,
                character: 1
            }
        });
        const shouldShow3 = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 14,
                character: 1
            }
        });
        expect(shouldShow1).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('**Final Value**\n___\n\t\'this is the final value for FINAL_VALUE\'')
            })
        }));
        expect(shouldShow2).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('**Final Value**\n___\n\t\'this is the final value for FINAL_VALUE with override o1\'')
            })
        }));
        expect(shouldShow3).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('**Final Value**\n___\n\t\'this is the final value for FINAL_VALUE with override containing variable expansion\'')
            })
        }));
    });
    it('should show description of license on hover', async () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.HOVER
        });
        const shouldShow = await (0, onHover_1.onHoverHandler)({
            textDocument: {
                uri: fixtures_1.DUMMY_URI
            },
            position: {
                line: 54,
                character: 43
            }
        });
        expect(shouldShow).toEqual(expect.objectContaining({
            contents: expect.objectContaining({
                value: expect.stringContaining('**GNU General Public License v2.0 w/Bison exception** (deprecated)\n___\n```Bison Exception')
            })
        }));
    });
});
//# sourceMappingURL=hover.test.js.map
"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const BitBakeDocScanner_1 = require("../BitBakeDocScanner");
const onRename_1 = require("../connectionHandlers/onRename");
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const fixtures_1 = require("./fixtures/fixtures");
describe('onRenameRequestHandler', () => {
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    it('should not prompt rename if it is not a symbol', () => {
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.RENAME
        });
        const renameParams = {
            position: { line: 2, character: 1 },
            newName: 'newName',
            textDocument: { uri: fixtures_1.DUMMY_URI }
        };
        const result = (0, onRename_1.onPrepareRenameHandler)(renameParams);
        expect(result).toBeNull();
    });
    it('should return expect edits', () => {
        BitBakeDocScanner_1.bitBakeDocScanner.parsePythonDatastoreFunction();
        analyzer_1.analyzer.analyze({
            uri: fixtures_1.DUMMY_URI,
            document: fixtures_1.FIXTURE_DOCUMENT.RENAME
        });
        const renameParams = {
            position: { line: 0, character: 1 },
            newName: 'newName',
            textDocument: { uri: fixtures_1.DUMMY_URI }
        };
        const result = (0, onRename_1.onRenameRequestHandler)(renameParams);
        expect(result).toEqual(expect.objectContaining({
            changes: {
                [fixtures_1.DUMMY_URI]: [
                    {
                        range: {
                            start: {
                                line: 0,
                                character: 0
                            },
                            end: {
                                line: 0,
                                character: 3
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 1,
                                character: 7
                            },
                            end: {
                                line: 1,
                                character: 10
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 8,
                                character: 4
                            },
                            end: {
                                line: 8,
                                character: 7
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 8,
                                character: 10
                            },
                            end: {
                                line: 8,
                                character: 13
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 8,
                                character: 16
                            },
                            end: {
                                line: 8,
                                character: 19
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 4,
                                character: 14
                            },
                            end: {
                                line: 4,
                                character: 17
                            }
                        },
                        newText: 'newName'
                    },
                    {
                        range: {
                            start: {
                                line: 7,
                                character: 18
                            },
                            end: {
                                line: 7,
                                character: 21
                            }
                        },
                        newText: 'newName'
                    }
                ]
            }
        }));
        // Make sure there is not additional changes
        expect(result?.changes?.[fixtures_1.DUMMY_URI]?.length).toBe(7);
    });
});
//# sourceMappingURL=onRename.test.js.map
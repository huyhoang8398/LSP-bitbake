"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const general_support_1 = require("../embedded-languages/general-support");
const analyzer_1 = require("../tree-sitter/analyzer");
const parser_1 = require("../tree-sitter/parser");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const python_support_1 = require("../embedded-languages/python-support");
const bash_support_1 = require("../embedded-languages/bash-support");
describe('Create basic embedded bash documents', () => {
    const uri = (0, crypto_1.randomUUID)();
    const bashHeader = (0, bash_support_1.getBashHeader)(uri);
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    test.each([
        [
            'basic',
            'foo(){\nBAR=""\n}',
            `${bashHeader}foo(){\nBAR=""\n}`
        ],
        [
            'with override',
            'foo:append(){\nBAR=""\n}',
            `${bashHeader}foo       (){\nBAR=""\n}`
        ],
        [
            'with inline python',
            'foo(){\n${@FOO}\n}',
            `${bashHeader}foo(){\n\${?   }\n}`
        ],
        [
            'with fakeroot',
            'fakeroot foo(){\nBAR=""\n}',
            `${bashHeader}         foo(){\nBAR=""\n}`
        ]
    ])('%s', async (description, input, result) => {
        const embeddedContent = await createEmbeddedContent(input, 'bash', uri);
        expect(embeddedContent).toEqual(result);
    });
});
describe('Create various basic embedded python documents', () => {
    const uri = (0, crypto_1.randomUUID)();
    const pythonHeader = (0, python_support_1.getPythonHeader)(uri);
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    test.each([
        [
            'anonymous',
            'python(){\n  pass\n}',
            `${pythonHeader}def _ ():\n  pass\n`
        ],
        [
            'named with python keyword',
            'python foo (){\n  pass\n}',
            `${pythonHeader}def foo ():\n  pass\n`
        ],
        [
            'empty',
            'python(){\n}',
            `${pythonHeader}def _ ():\n  pass\n`
        ],
        [
            'with def keyword',
            'def foo():\n  pass',
            `${pythonHeader}def foo():\n  pass`
        ],
        [
            'with fakeroot',
            'fakeroot python(){\n  pass\n}',
            `${pythonHeader}def _ ():\n  pass\n`
        ]
    ])('%s', async (description, input, result) => {
        const embeddedContent = await createEmbeddedContent(input, 'python', uri);
        expect(embeddedContent).toEqual(result);
    });
});
describe('Create Python embedded language content with inline Python', () => {
    const uri = (0, crypto_1.randomUUID)();
    const pythonHeader = (0, python_support_1.getPythonHeader)(uri);
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    test.each([
        [
            'basic',
            'FOO = \'${@"BAR"}\'',
            `${pythonHeader}         \n\n"BAR"\n `
        ],
        [
            'with spacing',
            'FOO = \'${@  "BAR"  }\'',
            `${pythonHeader}         \n  \n"BAR"  \n `
        ],
        [
            'multiline',
            'FOO = \'${@"BAR"}\' \\\n1 \\\n2"',
            `${pythonHeader}         \n\n"BAR"\n   \n   \n  `
        ],
        [
            'with two embedded python regions',
            'FOO = \'${@"BAR"}${@"BAR"}\'',
            `${pythonHeader}         \n\n"BAR"\n  \n\n"BAR"\n `
        ],
        [
            'without surrounding quotes',
            'inherit ${@"test"}',
            `${pythonHeader}          \n\n"test"\n`
        ],
        [
            'inside bash function',
            'foo(){\n${@FOO}\n}',
            `${pythonHeader}      \n  \n\nFOO\n\n `
        ]
    ])('%s', async (description, input, result) => {
        const embeddedContent = await createEmbeddedContent(input, 'python', uri);
        expect(embeddedContent).toEqual(result);
    });
});
describe('Finds proper embedded language type', () => {
    beforeAll(async () => {
        if (!analyzer_1.analyzer.hasParsers()) {
            const bitBakeParser = await (0, parser_1.generateBitBakeParser)();
            const bashParser = await (0, parser_1.generateBashParser)();
            analyzer_1.analyzer.initialize(bitBakeParser, bashParser);
        }
        analyzer_1.analyzer.resetAnalyzedDocuments();
    });
    test.each([
        [
            'BitBake variable',
            'BAR = "TEST"',
            { line: 0, character: 1 },
            undefined
        ],
        [
            'Bash function',
            'foo(){\n  BAR=""\n}',
            { line: 0, character: 3 },
            'bash'
        ],
        [
            'BitBake-Style Python Function',
            'python(){\n  pass\n}',
            { line: 1, character: 3 },
            'python'
        ],
        [
            'Python function',
            'def foo():\n  pass',
            { line: 1, character: 3 },
            'python'
        ],
        [
            'Inline Python',
            'FOO = "${@BAR}"',
            { line: 0, character: 11 },
            'python'
        ],
        [
            'Inline Python into Bash function',
            'foo(){\n  ${@BAR}\n}',
            { line: 1, character: 6 },
            'python'
        ]
    ])('%s', async (description, content, position, result) => {
        const uri = (0, crypto_1.randomUUID)();
        analyzer_1.analyzer.analyze({ document: vscode_languageserver_textdocument_1.TextDocument.create(uri, 'bitbake', 1, content), uri });
        const type = (0, general_support_1.getEmbeddedLanguageTypeOnPosition)(uri.toString(), position);
        expect(type).toEqual(result);
    });
});
const createEmbeddedContent = async (content, language, uri) => {
    const document = vscode_languageserver_textdocument_1.TextDocument.create(uri, 'bitbake', 1, content);
    analyzer_1.analyzer.analyze({ document, uri });
    const embeddedLanguageDocs = (0, general_support_1.generateEmbeddedLanguageDocs)(document);
    analyzer_1.analyzer.resetAnalyzedDocuments();
    return embeddedLanguageDocs?.find((embeddedLanguageDoc) => embeddedLanguageDoc.language === language)?.content;
};
//# sourceMappingURL=embedded-languages.test.js.map
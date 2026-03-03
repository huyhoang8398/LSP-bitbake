"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUMMY_URI = exports.FIXTURE_DOCUMENT = exports.FIXTURE_URI = void 0;
/**
 * Inspired by bash-language-server under MIT
 * Reference: https://github.com/bash-lsp/bash-language-server/blob/8c42218c77a9451b308839f9a754abde901323d5/testing/fixtures.ts
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const FIXTURE_FOLDER = path_1.default.join(__dirname, './');
function getDocument(uri) {
    return vscode_languageserver_textdocument_1.TextDocument.create(uri, 'bitbake', 0, fs_1.default.readFileSync(uri.replace('file://', ''), 'utf8'));
}
exports.FIXTURE_URI = {
    CORRECT: `file://${path_1.default.join(FIXTURE_FOLDER, 'correct.bb')}`,
    DECLARATION: `file://${path_1.default.join(FIXTURE_FOLDER, 'declarations.bb')}`,
    COMPLETION: `file://${path_1.default.join(FIXTURE_FOLDER, 'completion.bb')}`,
    HOVER: `file://${path_1.default.join(FIXTURE_FOLDER, 'hover.bb')}`,
    EMBEDDED: `file://${path_1.default.join(FIXTURE_FOLDER, 'embedded.bb')}`,
    SEMANTIC_TOKENS: `file://${path_1.default.join(FIXTURE_FOLDER, 'semanticTokens.bb')}`,
    DIRECTIVE: `file://${path_1.default.join(FIXTURE_FOLDER, 'directive.bb')}`,
    RENAME: `file://${path_1.default.join(FIXTURE_FOLDER, 'rename.bb')}`,
    BAZ_BBCLASS: `file://${path_1.default.join(FIXTURE_FOLDER, 'bbclass', 'baz.bbclass')}`,
    BAR_INC: `file://${path_1.default.join(FIXTURE_FOLDER, 'inc', 'bar.inc')}`,
    FOO_INC: `file://${path_1.default.join(FIXTURE_FOLDER, 'inc', 'foo.inc')}`,
    BITBAKE_CONF: `file://${path_1.default.join(FIXTURE_FOLDER, 'conf', 'bitbake.conf')}`
};
exports.FIXTURE_DOCUMENT = {
    CORRECT: getDocument(exports.FIXTURE_URI.CORRECT),
    DECLARATION: getDocument(exports.FIXTURE_URI.DECLARATION),
    COMPLETION: getDocument(exports.FIXTURE_URI.COMPLETION),
    HOVER: getDocument(exports.FIXTURE_URI.HOVER),
    EMBEDDED: getDocument(exports.FIXTURE_URI.EMBEDDED),
    SEMANTIC_TOKENS: getDocument(exports.FIXTURE_URI.SEMANTIC_TOKENS),
    DIRECTIVE: getDocument(exports.FIXTURE_URI.DIRECTIVE),
    RENAME: getDocument(exports.FIXTURE_URI.RENAME),
    BAZ_BBCLASS: getDocument(exports.FIXTURE_URI.BAZ_BBCLASS),
    BAR_INC: getDocument(exports.FIXTURE_URI.BAR_INC),
    FOO_INC: getDocument(exports.FIXTURE_URI.FOO_INC),
    BITBAKE_CONF: getDocument(exports.FIXTURE_URI.BITBAKE_CONF)
};
exports.DUMMY_URI = 'file://dummy_uri.bb';
//# sourceMappingURL=fixtures.js.map
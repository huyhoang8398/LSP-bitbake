"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const OutputLogger_1 = require("../../utils/OutputLogger");
jest.mock('vscode');
const mockChannel = () => {
    const mockOutputChannel = {
        appendLine: jest.fn(),
        show: jest.fn(),
        clear: jest.fn(),
        dispose: jest.fn()
    };
    vscode.window.createOutputChannel = jest.fn().mockImplementation(() => mockOutputChannel);
    return mockOutputChannel;
};
describe('OutputLogger Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should define a singleton logger instance', () => {
        expect(OutputLogger_1.logger).toBeDefined();
    });
    it('should correctly log messages with appropriate log level', () => {
        const mockOutputChannel = mockChannel();
        OutputLogger_1.logger.outputChannel = vscode.window.createOutputChannel('Bitbake');
        OutputLogger_1.logger.level = 'warning';
        const logSpy = jest.spyOn(mockOutputChannel, 'appendLine');
        OutputLogger_1.logger.debug('Debug message');
        OutputLogger_1.logger.info('Info message');
        OutputLogger_1.logger.warn('Warning message');
        OutputLogger_1.logger.error('Error message');
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith('Warning message');
        expect(logSpy).toHaveBeenCalledWith('Error message');
    });
});
//# sourceMappingURL=output-logger.test.js.map
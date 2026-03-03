"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2023 Savoir-faire Linux. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
const BitbakeSettings_1 = require("../../BitbakeSettings");
describe('BitbakeSettings Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should expand workspaceFolder', () => {
        const settings = (0, BitbakeSettings_1.loadBitbakeSettings)({
            pathToBitbakeFolder: '',
            pathToEnvScript: '',
            pathToBuildFolder: '${workspaceFolder}/build',
            workingDirectory: '',
            commandWrapper: ''
        }, '/home/user/workspace');
        expect(settings.pathToBuildFolder).toEqual('/home/user/workspace/build');
    });
    it('should keep relative paths', () => {
        const settings = (0, BitbakeSettings_1.loadBitbakeSettings)({
            pathToBitbakeFolder: '',
            pathToEnvScript: '',
            pathToBuildFolder: './build',
            workingDirectory: '',
            commandWrapper: ''
        }, __dirname);
        expect(settings.pathToBuildFolder).toEqual('./build');
    });
    it('should expand env variables', () => {
        const settings = (0, BitbakeSettings_1.loadBitbakeSettings)({
            pathToBitbakeFolder: '',
            pathToEnvScript: '',
            pathToBuildFolder: '${env:HOME}/build',
            workingDirectory: '',
            commandWrapper: ''
        }, '/home/user/workspace');
        expect(settings.pathToBuildFolder).toEqual(`${process.env.HOME}/build`);
    });
    it('should resolve environment variable inside shellEnv', () => {
        const settings = (0, BitbakeSettings_1.loadBitbakeSettings)({
            pathToBitbakeFolder: '',
            pathToEnvScript: '',
            pathToBuildFolder: '',
            workingDirectory: '',
            commandWrapper: '',
            shellEnv: {
                VAR1: '${env:HOME}/path1',
                VAR2: '${env:USER}/path2'
            }
        }, '/home/user/workspace');
        expect(settings.shellEnv).toEqual({
            VAR1: `${process.env.HOME}/path1`,
            VAR2: `${process.env.USER}/path2`
        });
    });
});
//# sourceMappingURL=bitbake-settings.test.js.map
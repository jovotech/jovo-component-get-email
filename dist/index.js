"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_framework_1 = require("jovo-framework");
const config_1 = require("./src/config");
const handler_1 = require("./src/handler");
class GetEmail extends jovo_framework_1.ComponentPlugin {
    constructor(config) {
        super(config);
        this.handler = handler_1.GetEmailHandler;
        this.config = config_1.Config;
        this.pathToI18n = './src/i18n/';
    }
}
exports.GetEmail = GetEmail;
//# sourceMappingURL=index.js.map
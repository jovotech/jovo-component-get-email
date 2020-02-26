import { ComponentPlugin, Handler } from 'jovo-framework';

import { Config, IGetEmailConfig } from './src/config';
import { GetEmailHandler } from './src/handler';

export class GetEmail extends ComponentPlugin {
    config: IGetEmailConfig = Config;
    pathToI18n: string = './src/i18n/';
    name = 'jovo-component-get-email';
    handler: Handler = {
        [this.name!]: GetEmailHandler
    };

    constructor(config?: IGetEmailConfig) {
        super(config);
    }
}
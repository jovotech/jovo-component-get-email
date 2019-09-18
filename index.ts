import { Handler } from 'jovo-core';
import { ComponentPlugin } from 'jovo-framework';

import { Config, IGetEmailConfig } from './src/config';
import { GetEmailHandler } from './src/handler';

export class GetEmail extends ComponentPlugin {
    handler: Handler = GetEmailHandler;
    config: IGetEmailConfig = Config;
    pathToI18n: string = './src/i18n/';

    constructor(config?: IGetEmailConfig) {
        super(config);
    }
}
import { Handler } from 'jovo-core';
import { ComponentPlugin } from 'jovo-framework';
import { IGetEmailConfig } from './src/config';
export declare class GetEmail extends ComponentPlugin {
    handler: Handler;
    config: IGetEmailConfig;
    pathToI18n: string;
    constructor(config?: IGetEmailConfig);
}

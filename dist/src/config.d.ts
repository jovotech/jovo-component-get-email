import { ComponentConfig } from 'jovo-framework';
export interface IGetEmailConfig extends ComponentConfig {
    alexa?: {
        type: string;
        accountLinkingProvider?: string;
        uri?: string;
    };
    googleAssistant?: {
        accountLinkingProvider: string;
        uri?: string;
    };
}
export declare const Config: IGetEmailConfig;

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

export const Config: IGetEmailConfig = {
    alexa: {
        type: 'contact-permissions',
        //
        // type: 'account-linking',
        // accountLinkingProvider: 'auth0'
        // uri: 'https://your-profile.auth0.com/userinfo'
        //
        // type: 'account-linking',
        // accountLinkingProvider: 'login-with-amazon'
    },
    googleAssistant: {
        accountLinkingProvider: 'login-with-google'
        // 
        // accountLinkingProvider: 'auth0',
        // uri: 'https://your-profile.auth0.com/userinfo'
    }
};
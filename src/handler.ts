'use strict';

import * as https from 'https';
import * as jwtDecode from 'jwt-decode';
import { Handler, Jovo } from 'jovo-core';
import { ComponentResponse } from 'jovo-framework';

interface Data {
    email?: string;
    error?: Error;
}

interface Config {
    type?: string;
    accountLinkingProvider?: string;
    uri?: string;
}

type STATUS = 'SUCCESSFUL' | 'ERROR' | 'REJECTED';

/**
 * Entry point for GetEmailHandler. Determines what method to use to fetch users email.
 * @param this: Jovo object to operate on. 
 */
async function START(this: Jovo) {
    const data: Data = {};
    // @ts-ignore
    if (this.isAlexaSkill()) {
        const config: Config = this.$components.GetEmail.config.alexa;
        const token = this.getAccessToken();

        if (config.type === 'account-linking') {
            if (!token) {
                this.$speech.t('component-email-start-account-linking');
                // @ts-ignore
                this.$alexaSkill
                    .showAccountLinkingCard()
                    .tell(this.$speech);
            } else {
                await accountLinkingAlexa(config, data, token);

                const status = data.error ? 'ERROR' : 'SUCCESSFUL';
                sendComponentResponse(this, status, data, data.error);
            }
        } else if (config.type === 'contact-permissions') {
            try {
                // @ts-ignore
                data.email = await this.$alexaSkill.$user.getEmail();
                sendComponentResponse(this, 'SUCCESSFUL', data);
            } catch (error) {
                if (error.code === 'ACCESS_DENIED' || error.code === 'NO_USER_PERMISSION') {
                    this.$speech.t('component-email-start-contact-permissions');
                    // @ts-ignore
                    this.$alexaSkill
                        .showAskForContactPermissionCard('email')
                        .tell(this.$speech);
                } else {
                    sendComponentResponse(this, 'ERROR', data, error);
                }
            }
        }
        // @ts-ignore
    } else if (this.isGoogleAction()) {
        const config: Config = this.$components.GetEmail.config.googleAssistant;
        const token = this.getAccessToken();
        if (!token) {
            // @ts-ignore
            this.askForSignIn();
        } else {
            await accountLinkingGoogleAssistant(config, data, token, this.$request!);

            const status = data.error ? 'ERROR' : 'SUCCESSFUL';
            sendComponentResponse(this, status, data, data.error);
        }
    }
}

async function ON_SIGN_IN(this: Jovo) {
    const {
        alexa: alexaConfig,
        googleAssistant: googleAssistantConfig
    } = this.$components.GetEmail.config;

    const data: Data = {};
    const token = this.getAccessToken()!;
    // @ts-ignore
    if (this.isAlexaSkill()) {
        await accountLinkingAlexa(alexaConfig, data, token)
        // @ts-ignore
    } else if (this.isGoogleAction()) {
        await accountLinkingGoogleAssistant(googleAssistantConfig, data, token, this.$request!);
    }

    const status = data.error ? 'ERROR' : 'SUCCESSFUL';
    sendComponentResponse(this, status, data, data.error)
}

async function accountLinkingAlexa(config: Config, data: Data, token: string) {
    if (config.accountLinkingProvider === 'auth0') {
        await auth0Request(config.uri!, data, token);
    } else {
        const uri = `https://api.amazon.com/user/profile?access_token=${token}`;
        try {
            const res: { email?: string } = await httpsGet(uri);
            data.email = res.email;
        } catch (error) {
            data.error = new Error(error);
        }
    }
}

async function accountLinkingGoogleAssistant(config: { [key: string]: any }, data: Data, token: string, request: { [key: string]: any }) {
    if (config.accountLinkingProvider === 'auth0') {
        await auth0Request(config.uri!, data, token)
    } else {
        const { idToken } = request.originalDetectIntentRequest.payload.user;
        const userInfo: { email?: string } = jwtDecode(idToken);
        data.email = userInfo.email;
    }
}

async function auth0Request(uri: string, data: Data, token: string) {
    try {
        const options = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        const res: { email?: string } = await httpsGet(uri, options);
        data.email = res.email;
    } catch (error) {
        data.error = new Error(error);
    }
}

function httpsGet(url: string, options: { headers: { authorization: string } } | {} = {}): Promise<any> {
    return new Promise((res, rej) => {
        https.get(url, options, (r) => {
            let body = '';
            r.on('data', (d) => {
                body += d;
            });

            r.on('error', (e) => {
                rej(e);
            });

            r.on('end', () => {
                if (r.statusCode === 400) {
                    return rej('Something went wrong while fetching your users email address.');
                }
                res(JSON.parse(body));
            });
        }).on('error', (e) => {
            rej(e);
        });
    });
}

function sendComponentResponse(jovo: Jovo, status: STATUS, data?: object, error?: Error) {
    const response: ComponentResponse = { status };

    if (data) {
        response.data = data;
    } else if (error) {
        response.error = error;
    }

    // @ts-ignore
    return jovo.sendComponentResponse(response);
}

export const GetEmailHandler: Handler = {
    GetEmail: {
        START,
        ON_SIGN_IN
    }
};
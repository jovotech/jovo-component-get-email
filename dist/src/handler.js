'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const jwtDecode = require("jwt-decode");
async function START() {
    const data = {};
    if (this.isAlexaSkill()) {
        const config = this.$components.GetEmail.config.alexa;
        const token = this.getAccessToken();
        if (config.type === 'account-linking') {
            if (!token) {
                this.$speech.t('component-email-start-account-linking');
                this.$alexaSkill
                    .showAccountLinkingCard()
                    .tell(this.$speech);
            }
            else {
                await accountLinkingAlexa(config, data, token);
                const status = data.error ? 'ERROR' : 'SUCCESSFUL';
                sendComponentResponse(this, status, data, data.error);
            }
        }
        else if (config.type === 'contact-permissions') {
            try {
                data.email = await this.$alexaSkill.$user.getEmail();
                sendComponentResponse(this, 'SUCCESSFUL', data);
            }
            catch (error) {
                if (error.code === 'ACCESS_DENIED' || error.code === 'NO_USER_PERMISSION') {
                    this.$speech.t('component-email-start-contact-permissions');
                    this.$alexaSkill
                        .showAskForContactPermissionCard('email')
                        .tell(this.$speech);
                }
                else {
                    sendComponentResponse(this, 'ERROR', data, error);
                }
            }
        }
    }
    else if (this.isGoogleAction()) {
        const config = this.$components.GetEmail.config.googleAssistant;
        const token = this.getAccessToken();
        if (!token) {
            this.askForSignIn();
        }
        else {
            await accountLinkingGoogleAssistant(config, data, token, this.$request);
            const status = data.error ? 'ERROR' : 'SUCCESSFUL';
            sendComponentResponse(this, status, data, data.error);
        }
    }
}
async function ON_SIGN_IN() {
    const { alexa: alexaConfig, googleAssistant: googleAssistantConfig } = this.$components.GetEmail.config;
    const data = {};
    const token = this.getAccessToken();
    if (this.isAlexaSkill()) {
        await accountLinkingAlexa(alexaConfig, data, token);
    }
    else if (this.isGoogleAction()) {
        await accountLinkingGoogleAssistant(googleAssistantConfig, data, token, this.$request);
    }
    const status = data.error ? 'ERROR' : 'SUCCESSFUL';
    sendComponentResponse(this, status, data, data.error);
}
async function accountLinkingAlexa(config, data, token) {
    if (config.accountLinkingProvider === 'auth0') {
        await auth0Request(config.uri, data, token);
    }
    else {
        const uri = `https://api.amazon.com/user/profile?access_token=${token}`;
        try {
            const res = await httpsGet(uri);
            data.email = res.email;
        }
        catch (error) {
            data.error = new Error(error);
        }
    }
}
async function accountLinkingGoogleAssistant(config, data, token, request) {
    if (config.accountLinkingProvider === 'auth0') {
        await auth0Request(config.uri, data, token);
    }
    else {
        const { idToken } = request.originalDetectIntentRequest.payload.user;
        const userInfo = jwtDecode(idToken);
        data.email = userInfo.email;
    }
}
async function auth0Request(uri, data, token) {
    try {
        const options = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };
        const res = await httpsGet(uri, options);
        data.email = res.email;
    }
    catch (error) {
        data.error = new Error(error);
    }
}
function httpsGet(url, options = {}) {
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
function sendComponentResponse(jovo, status, data, error) {
    const response = { status };
    if (data) {
        response.data = data;
    }
    else if (error) {
        response.error = error;
    }
    return jovo.sendComponentResponse(response);
}
exports.GetEmailHandler = {
    GetEmail: {
        START,
        ON_SIGN_IN
    }
};
//# sourceMappingURL=handler.js.map
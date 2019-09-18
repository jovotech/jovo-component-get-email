# Jovo Conversational Component: GetEmail

## Getting Started

The component provides a prepackaged solution to get your user's email address.

> [Find out more about Jovo's Conversational Components](https://www.jovo.tech/docs/components)

### Installation

You can install the component using npm:

```sh
$ npm install --save jovo-component-get-email
```

After that, you use the Jovo CLI to transfer the component's files to your project using te `load` command:

```sh
$ jovo load jovo-component-get-email
```

Last but not least you have to include the component in your `app.js`:

```js
// @language=typescript
// src/app.ts

import { GetEmail } from './components/jovo-component-get-email';

app.useComponents(new GetEmail());

// @language=javascript
// src/app.js

const { GetEmail } = require("../components/jovo-component-get-email/index");

app.useComponents(new GetEmail());
```

## Response

The component's `$response` has the following interface:

```javascript
{
    status: "SUCCESSFUL" | "REJECTED" | "ERROR",
    data: {
        email: "string"
    }
}
```

The `data` property will only be defined, if the component was successful!

> [Find out more about Conversational Component's responses](https://www.jovo.tech/docs/components#response)

## Configuration

The component allows you to fetch the users email address, either with Account Linking (Alexa|GoogleAssistant) or Contact Permissions (Alexa). Based on which one you want to choose, you need to configure the component accordingly.

```js
// config.js

module.exports = {
    // ...
    components: {
        GetEmailComponent: {
            alexa: {
                type: 'contact-permissions|account-linking',
                // 
                // If you choose to use account linking in your skill, 
                // you have the option to choose either Login-With-Amazon or Auth0 as a provider.
                //
                // accountLinkingProvider: 'login-with-amazon'
                //
                // accountLinkingProvider: 'auth0'
                // uri: 'https://your-profile.auth0.com/userinfo'
            },
            googleAssistant: {
                // For Google Assistant, as of now, Account Linking is the only option to fetch a users email address. 
                // As for Alexa, you have the choice between Auth0 or the platform-specific provider Login-With-Google.
                //
                accountLinkingProvider: 'login-with-google'
                //
                // accountLinkingProvider: 'auth0',
                // uri: 'https://your-profile.auth0.com/userinfo'
            }
        }
    }
};
```


> [Find out more about Conversational Component's configuration](https://www.jovo.tech/docs/components#configuration)
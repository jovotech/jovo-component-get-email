/// <reference types="node" />
import { RequestOptions } from 'http';
import { BaseApp } from './BaseApp';
import { Data, JovoRequest, JovoResponse, SessionData } from './Interfaces';
import { TestSuite } from './TestSuite';
declare type ConversationTestRuntime = 'app' | 'server';
export interface ConversationConfig {
    userId?: string;
    locale?: string;
    runtime?: ConversationTestRuntime;
    defaultDbDirectory?: string;
    deleteDbOnSessionEnded?: boolean;
    httpOptions?: RequestOptions;
}
export declare class Conversation {
    testSuite: TestSuite;
    sessionData: SessionData;
    app?: BaseApp;
    $user: {
        $data: Data;
        $metaData: Data;
    };
    config: ConversationConfig;
    constructor(testSuite: TestSuite, config?: ConversationConfig);
    /**
     * Sets userid, timestamp and locale to every request.
     * @param {JovoRequest} req
     */
    applyToRequest(req: JovoRequest): void;
    /**
     * Set request user and session data
     * @param req
     */
    prepare(req: JovoRequest): Promise<JovoRequest>;
    /**
     * Send request to server or directly to the app, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    send(req: JovoRequest): Promise<JovoResponse>;
    /**
     * Send request to server, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    sendToServer(req: JovoRequest): Promise<JovoResponse>;
    /**
     * Send request directly to app, resolve with response.
     * Rejects with Error on failure.
     * @param {JovoRequest} req
     * @returns {Promise<JovoResponse>}
     */
    sendToApp(req: JovoRequest, app: BaseApp): Promise<JovoResponse>;
    /**
     * Perform user/session data housekeeping with response
     * @param jovoResponse
     */
    postProcess(jovoResponse: JovoResponse): Promise<void>;
    /**
     * Clears session data for this conversation object
     */
    clearSession(): void;
    /**
     * Resets conversation. Clears database and session
     * @returns {Promise<void>}
     */
    reset(): Promise<void>;
    /**
     * Deletes filedb jsonf ile
     * @returns {Promise<void>}
     */
    clearDb(): Promise<void>;
    /**
     * Saves conversation.$data and conversation.$metaData to file db json.
     * @returns {Promise<void>}
     */
    private saveUserData;
    /**
     * Updates conversation.$data and conversation.$meta from file db json.
     * @returns {Promise<void>}
     */
    private updateUserData;
    /**
     * Post request to the separately running jovo voice app instance
     * @param {string} postData
     * @param {RequestOptions} options
     * @returns {Promise<any>}
     */
    private static httpRequest;
}
export {};

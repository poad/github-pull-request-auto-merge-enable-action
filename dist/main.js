"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const client_1 = __importDefault(require("./client"));
const run = () => {
    const errHandler = (error) => {
        core.error(error.message);
        core.setFailed(error.message);
    };
    try {
        const token = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const owner = core.getInput('owner');
        const repo = core.getInput('repository');
        core.info(`owner: ${owner}`);
        core.info(`repo: ${repo}`);
        core.info(`pullRequestNumber: ${pullRequestNumber}`);
        const client = new client_1.default(token);
        Promise.resolve(client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber
        }).then(id => {
            if (id !== undefined) {
                client.enableAutoMerge(id);
            }
        })
            .catch(errHandler)).catch(reason => { throw reason; });
    }
    catch (error) {
        errHandler(error);
    }
};
run();

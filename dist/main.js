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
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const client_1 = __importStar(require("./client"));
const run = async () => {
    const errHandler = (error) => {
        const e = error instanceof Error ? error : JSON.stringify(error);
        core.error(e);
        core.setFailed(e);
    };
    try {
        const token = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const pullRequestId = core.getInput('pull_request_id');
        const owner = core.getInput('owner');
        const repo = core.getInput('repository');
        const mergeMethod = core.getInput('merge_method');
        core.info(`owner: ${owner}`);
        core.info(`repo: ${repo}`);
        core.info(`pullRequestNumber: ${pullRequestNumber}`);
        core.info(`pullRequestId: ${pullRequestId}`);
        core.info(`mergeMethod: ${mergeMethod}`);
        if (pullRequestNumber === 0 && pullRequestId === undefined) {
            errHandler(new Error("pull_request_number or pull_request_id must be specified"));
        }
        const client = new client_1.default(token);
        const id = pullRequestNumber !== 0 ? await client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber
        }) : pullRequestId;
        core.info(`target pull request id: ${id}`);
        if (id !== undefined) {
            await client.enableAutoMerge({
                pullRequestId: id,
                mergeMethod: mergeMethod !== undefined ? client_1.MergeMethod.valueOf(mergeMethod) : undefined
            });
        }
    }
    catch (error) {
        errHandler(error);
    }
};
Promise.resolve(run()).catch((error) => {
    if (error.stack !== undefined) {
        core.error(error.stack);
    }
    core.setFailed(error);
});

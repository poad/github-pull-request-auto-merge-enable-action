"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.MergeMethod = void 0;
const graphql_1 = require("@octokit/graphql");
const core = __importStar(require("@actions/core"));
var MergeMethod;
(function (MergeMethod) {
    MergeMethod["MERGE"] = "MERGE";
    MergeMethod["REBASE"] = "REBASE";
    MergeMethod["SQUASH"] = "SQUASH";
})(MergeMethod = exports.MergeMethod || (exports.MergeMethod = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace
(function (MergeMethod) {
    const reverseMap = new Map();
    Object.keys(MergeMethod).forEach((s) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = MergeMethod[s];
        reverseMap.set(e.toString(), e);
    });
    function valueOf(str) {
        return reverseMap.get(str);
    }
    MergeMethod.valueOf = valueOf;
})(MergeMethod = exports.MergeMethod || (exports.MergeMethod = {}));
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async findPullRequestId(params) {
        const query = `
    query {
      repository(owner: "${params.owner}", name: "${params.repo}") {
        pullRequest(number: ${params.number}) {
          id,
          state
        }
      }
    }
    `;
        const { data } = await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
        core.debug(JSON.stringify(data));
        const repository = data.repository;
        const pullRequest = repository !== undefined ? repository.pullRequest : undefined;
        const { id, state } = pullRequest !== undefined
            ? pullRequest
            : { id: undefined, state: undefined };
        if (id === undefined || state === undefined) {
            return undefined;
        }
        return { id, state };
    }
    async enableAutoMerge(param) {
        const query = `
      mutation {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${param.pullRequestId}",
          ${param.mergeMethod !== undefined
            ? `mergeMethod: ${param.mergeMethod.toString()}`
            : ''}
          clientMutationId : null
        }) {
          clientMutationId
        }
      }
      `;
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=client.js.map
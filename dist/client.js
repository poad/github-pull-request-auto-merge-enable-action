"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeMethod = void 0;
const graphql_1 = require("@octokit/graphql");
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
          id
        }
      }
    }
    `;
        const { data } = await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
        });
        return data.repository !== undefined && data.repository.pullRequest !== undefined ? data.repository.pullRequest.id : undefined;
    }
    async enableAutoMerge(param) {
        const query = `
      mutation {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${param.pullRequestId}",
          ${param.mergeMethod !== undefined ? `mergeMethod: ${param.mergeMethod.toString()}` : ""}
          clientMutationId : null
        }) {
          clientMutationId
        }
      }
      `;
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=client.js.map
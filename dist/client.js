import { graphql } from '@octokit/graphql';
import * as core from '@actions/core';
export var MergeMethod;
(function (MergeMethod) {
    MergeMethod["MERGE"] = "MERGE";
    MergeMethod["REBASE"] = "REBASE";
    MergeMethod["SQUASH"] = "SQUASH";
})(MergeMethod || (MergeMethod = {}));
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
})(MergeMethod || (MergeMethod = {}));
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
        const { data } = await graphql(query, {
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
        await graphql(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
    }
}
export default GitHubClient;
//# sourceMappingURL=client.js.map
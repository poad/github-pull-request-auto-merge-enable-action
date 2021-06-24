"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@octokit/graphql");
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async findPullRequestId(params) {
        const query = `
    query {
        repository(owner: ${params.owner}, name: ${params.repo}) {
          pullRequest(number: ${params.number}) {
            node {
              id
            }
          }
        }
    }
    `;
        const { data } = await graphql_1.graphql(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
        });
        return data.repository !== undefined && data.repository.pullRequest !== undefined ? data.repository.pullRequest.id : undefined;
    }
    async enableAutoMerge(pullRequestId) {
        const query = `
      mutation {
          enablePullRequestAutoMerge(input: {
              pullRequestId: "${pullRequestId}",
              clientMutationId : null
            }) {
              clientMutationId
            }
          }
      }
      `;
        await graphql_1.graphql(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
        });
    }
}
exports.default = GitHubClient;

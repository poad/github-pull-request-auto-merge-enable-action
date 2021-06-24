import { graphql } from "@octokit/graphql";

interface FindPullRequestIdParam {
    owner: string;
    repo: string;
    number: number;
}

interface IGitHubClient {
    findPullRequestId(params: FindPullRequestIdParam): Promise<string | undefined>;
    enableAutoMerge(pullRequestId: string): Promise<void>;
}

class GitHubClient implements IGitHubClient {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }
    async findPullRequestId(params: FindPullRequestIdParam): Promise<string | undefined> {
        const { data } = await graphql(
            `
            query {
                repository(owner: ${params.owner}, name: ${params.repo}) {
                  pullRequest(number:${params.number}) {
                    node {
                      id
                    }
                  }
                }
            }
            `,
            {
              headers: {
                authorization: `token ${this.token}`,
              },
            }
          );
          return data.repository !== undefined && data.repository.pullRequest !== undefined ? data.repository.pullRequest.id : undefined;
    }
    async enableAutoMerge(pullRequestId: string): Promise<void> {
        await graphql(
            `
            mutation {
                enablePullRequestAutoMerge(input: {
                    pullRequestId: "${pullRequestId}",
                    clientMutationId : null
                  }) {
                    clientMutationId
                  }
                }
            }
            `,
            {
              headers: {
                authorization: `token ${this.token}`,
              },
            }
          );
    }

    
}

export default GitHubClient;

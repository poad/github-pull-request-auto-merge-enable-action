import * as core from "@actions/core";
import { graphql } from "@octokit/graphql";
import "source-map-support/register";

export type MergeMethod = "MERGE" | "REBASE" | "SQUASH";

export interface FindPullRequestIdParam {
  owner: string;
  repo: string;
  number: number;
}

export interface IPullRequestResponse {
  repository?: {
    pullRequest: IPullRequest;
  };
}

export interface IPullRequest {
  id?: string;
  state?: "OPEN" | "CLOSED" | "MERGED";
  reviews: {
    nodes: {
      id: string;
    }[];
  };
}

export interface EnableAutoMergeParam {
  pullRequestId: string;
  mergeMethod?: MergeMethod;
}

export interface ApprovePullRequestReviewParam {
  pullRequestId: string;
  reviewId: string;
}

export interface IGitHubClient {
  findPullRequestId(
    params: FindPullRequestIdParam,
  ): Promise<IPullRequest | undefined>;
  enableAutoMerge(param: EnableAutoMergeParam): Promise<void>;
  approvePullRequestReview(param: ApprovePullRequestReviewParam): Promise<void>;
}

class GitHubClient implements IGitHubClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async approvePullRequestReview({
    pullRequestId,
    reviewId,
  }: ApprovePullRequestReviewParam) {
    const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          mergeMethod: "${reviewId}"
        }) {
          clientMutationId
          pullRequestReview
        }
      }
      `;

    core.debug(`execute graphql mutation ${query}`);
    await graphql(query, {
      headers: {
        authorization: `token ${this.token}`,
      },
      request: {
        fetch,
      },
    });
  }

  async findPullRequestId({
    owner,
    repo,
    number,
  }: FindPullRequestIdParam): Promise<IPullRequest | undefined> {
    const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          id
          state
          reviews(last: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
    `;
    const response = await graphql<IPullRequestResponse>(query, {
      headers: {
        authorization: `token ${this.token}`,
      },
      request: {
        fetch,
      },
    });

    core.debug(`response: ${response ? JSON.stringify(response) : undefined}`);

    return response?.repository?.pullRequest;
  }

  async enableAutoMerge({
    pullRequestId,
    mergeMethod,
  }: EnableAutoMergeParam): Promise<void> {
    const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod ? `mergeMethod: ${mergeMethod.toString()}` : ""}
        }) {
          clientMutationId
        }
      }
      `;

    core.debug(`execute graphql mutation ${query}`);
    await graphql(query, {
      headers: {
        authorization: `token ${this.token}`,
      },
      request: {
        fetch,
      },
    });
  }
}

export default GitHubClient;

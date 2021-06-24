import { graphql } from "@octokit/graphql";

export enum MergeMethod {
  MERGE = "MERGE",
  REBASE = "REBASE",
  SQUASH= "SQUASH",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MergeMethod {
  const reverseMap = new Map<string, MergeMethod>();
  Object.keys(MergeMethod).forEach((s: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = (<any>MergeMethod)[s];
    reverseMap.set(e.toString(), e);
  });
  export function valueOf(str: string): MergeMethod | undefined {
    return reverseMap.get(str);
  }
}

export interface FindPullRequestIdParam {
  owner: string;
  repo: string;
  number: number;
}

export interface EnableAutoMergeParam {
  pullRequestId: string;
  mergeMethod?: MergeMethod,
}


interface IGitHubClient {
  findPullRequestId(params: FindPullRequestIdParam): Promise<string | undefined>;
  enableAutoMerge(param: EnableAutoMergeParam): Promise<void>;
}

class GitHubClient implements IGitHubClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }
  async findPullRequestId(params: FindPullRequestIdParam): Promise<string | undefined> {
    const query = `
    query {
      repository(owner: "${params.owner}", name: "${params.repo}") {
        pullRequest(number: ${params.number}) {
          id
        }
      }
    }
    `;
    const { data } = await graphql(
      query,
      {
        headers: {
          authorization: `token ${this.token}`,
        },
      }
    );
    return data.repository !== undefined && data.repository.pullRequest !== undefined ? data.repository.pullRequest.id : undefined;
  }

  async enableAutoMerge(param: EnableAutoMergeParam): Promise<void> {
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
    await graphql(
      query,
      {
        headers: {
          authorization: `token ${this.token}`,
        },
      }
    );
  }
}

export default GitHubClient;

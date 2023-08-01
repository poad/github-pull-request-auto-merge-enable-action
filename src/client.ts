import {graphql} from '@octokit/graphql'
import * as core from '@actions/core'
import fetch from 'node-fetch'
import 'source-map-support/register'

export enum MergeMethod {
  MERGE = 'MERGE',
  REBASE = 'REBASE',
  SQUASH = 'SQUASH'
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MergeMethod {
  const reverseMap = new Map<string, MergeMethod>()
  Object.keys(MergeMethod).forEach((s: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = (<any>MergeMethod)[s]
    reverseMap.set(e.toString(), e)
  })
  export function valueOf(str: string): MergeMethod | undefined {
    return reverseMap.get(str)
  }
}

export interface FindPullRequestIdParam {
  owner: string
  repo: string
  number: number
}

export interface IPullRequestResponse {
  repository?: {
    pullRequest?: IPullRequest
  }
}

export interface IPullRequest {
  id?: string
  state?: 'OPEN' | 'CLOSED' | 'MERGED'
}

export interface EnableAutoMergeParam {
  pullRequestId: string
  mergeMethod?: MergeMethod
}

interface IGitHubClient {
  findPullRequestId(
    params: FindPullRequestIdParam
  ): Promise<IPullRequest | undefined>
  enableAutoMerge(param: EnableAutoMergeParam): Promise<void>
}

class GitHubClient implements IGitHubClient {
  private token: string

  constructor(token: string) {
    this.token = token
  }
  async findPullRequestId({
    owner,
    repo,
    number
  }: FindPullRequestIdParam): Promise<IPullRequest | undefined> {
    const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          id
          state
        }
      }
    }
    `
    const response = await graphql<IPullRequestResponse>(query, {
      headers: {
        authorization: `token ${this.token}`
      },
      request: {
        fetch
      }
    })

    core.debug(`response: ${response ? JSON.stringify(response) : undefined}`)

    return response.repository?.pullRequest
  }

  async enableAutoMerge({
    pullRequestId,
    mergeMethod
  }: EnableAutoMergeParam): Promise<void> {
    const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod ? `mergeMethod: ${mergeMethod.toString()}` : ''}
        }) {
          clientMutationId
        }
      }
      `

    core.debug(`execute graphql mutation ${query}`)
    await graphql(query, {
      headers: {
        authorization: `token ${this.token}`
      },
      request: {
        fetch
      }
    })
  }
}

export default GitHubClient

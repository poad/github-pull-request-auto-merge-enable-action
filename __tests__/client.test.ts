import { expect, it, describe, jest, beforeEach } from '@jest/globals';
import { RequestParameters } from '@octokit/graphql/dist-types/types';
import 'source-map-support/register'

describe("graphql()", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  // beforeAll(() => {
  // });

  it("find pull request id", async () => {
    // jest.mock('node-fetch', async () => {
    //   const nodeFetch = jest.requireActual('node-fetch');
    //   const fetchMock = (await import('fetch-mock')).sandbox();
    //   Object.assign(fetchMock.config, {
    //     fetch: nodeFetch
    //   });
    //   return fetchMock;
    // })

    jest.doMock('@octokit/graphql', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return jest.fn((query: string, parameters?: RequestParameters | undefined) => ({
        repository: {
          pullRequest: {
            id: '100',
            state: 'OPEN'
          }
        }
      }));
    })
    const  GitHubClient = (await import('../src/client')).default

    const client = new GitHubClient('');
    const pullRequest = await client.findPullRequestId({
        owner: '',
        repo: '',
        number: 0
    });

    expect(pullRequest?.id).not.toBeNull();
  });

});

import { it, describe, jest, beforeEach, afterEach } from '@jest/globals';
import 'source-map-support/register'


describe("graphql()", () => {
  beforeEach(() => {
    jest.mock('@octokit/graphql')
  });

  afterEach(() => {
    jest.resetModules();
  });

  it("find pull request id", async () => {
  //   const GitHubClient = (await import('../src/client')).default

  //   jest.fn().mockReturnValue({
  //       data: {
  //         repository: {
  //           pullRequest: {
  //             id: '100',
  //             state: 'OPEN'
  //           }
  //         }
  //       }
  //     });

  //   const client = new GitHubClient('');
  //   const pullRequest = await client.findPullRequestId({
  //       owner: '',
  //       repo: '',
  //       number: 0
  //   });

  //   expect(pullRequest?.id).not.toBeNull();
  });

});

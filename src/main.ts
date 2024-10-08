import * as core from '@actions/core';
import GitHubClient, { type MergeMethod } from './client.js';

export interface Params {
  token: string;
  owner: string;
  repo: string;
  pullRequestNumber: number;
  mergeMethod?: string;
  withApprove: boolean;
}

/// domain logic
export async function run({
  token,
  owner,
  repo,
  pullRequestNumber,
  mergeMethod,
  withApprove,
}: Params): Promise<void> {
  if (mergeMethod) {
    switch (mergeMethod) {
      case 'MERGE':
      case 'REBASE':
      case 'SQUASH':
        // OK
        break;
      default:
        core.error(`Unsupported Merge Method: ${mergeMethod}`);
        throw new Error();
    }
  }

  const client = new GitHubClient(token);

  const resp = await client.findPullRequestId({
    owner,
    repo,
    number: pullRequestNumber,
  });

  if (resp) {
    const { id, state, reviews } = resp;
    if (state !== 'OPEN') {
      core.warning(`target pull request state: ${state}`);
      return;
    }

    core.info(`target pull request id: ${id}`);

    if (id) {
      const approver =
        withApprove && reviews.nodes.length > 0
          ? async () => {
            const reviewId = reviews.nodes[0].id;
            client.approvePullRequestReview({
              pullRequestId: id,
              reviewId,
            });
          }
          : async () => {
            // pass
          };

      await approver().then(
        async () =>
          await client.enableAutoMerge(
            mergeMethod
              ? {
                pullRequestId: id,
                mergeMethod: mergeMethod as MergeMethod,
              }
              : { pullRequestId: id },
          ),
      );
    }
  }
}

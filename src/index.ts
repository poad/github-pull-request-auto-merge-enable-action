import * as core from '@actions/core';
import { GraphqlResponseError } from '@octokit/graphql';
import 'source-map-support/register';
import { run } from './main.js';

// error handler
function errHandler(error: unknown) {
  if (error instanceof GraphqlResponseError) {
    core.error(
      // eslint-disable-next-line max-len
      'Unable to enable automerge.Enable branch protection and activate one or more "branch protection rules". See https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request#enabling-auto-merge and https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule for more information',
    );
    core.setFailed(error);
    return;
  }
  if (error instanceof Error) {
    core.error(error);
    core.setFailed(error);
    return;
  }
  const e = error instanceof Error ? error : JSON.stringify(error);
  core.error(e);
  core.setFailed(e);
}

/// main process
async function main(): Promise<void> {
  try {
    const token: string = core.getInput('github_token');
    const pullRequestNumber = Number(core.getInput('pull_request_number'));
    const owner: string = core.getInput('owner');
    const repo: string = core.getInput('repository');
    const mergeMethod: string = core.getInput('merge_method');
    const withApprove: boolean = core.getBooleanInput('with_approve');

    core.info(`owner: ${owner}`);
    core.info(`repository: ${repo}`);
    core.info(`pull_request_number: ${pullRequestNumber}`);
    core.info(`merge_method: ${mergeMethod}`);

    if (pullRequestNumber === 0) {
      errHandler(
        new Error('pull_request_number or pull_request_id must be specified'),
      );
    }

    run({
      token,
      pullRequestNumber,
      owner,
      repo,
      mergeMethod,
      withApprove,
    });
  } catch (error) {
    errHandler(error);
  }
}

/// entrypoint
function entrypoint() {
  Promise.resolve(main()).catch((error: Error) => {
    core.error(error.stack ? error.stack?.toString() : error);
    core.setFailed(error);
  });
}

entrypoint();

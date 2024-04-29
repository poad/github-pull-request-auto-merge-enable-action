import * as core from "@actions/core";
import { GraphqlResponseError } from "@octokit/graphql";
import "source-map-support/register";
import GitHubClient, { type IPullRequest, MergeMethod } from "./client.js";

async function run(): Promise<void> {
  const errHandler = (error: unknown) => {
    if (error instanceof GraphqlResponseError) {
      core.error(
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
  };
  try {
    const token: string = core.getInput("github_token");
    const pullRequestNumber = Number(core.getInput("pull_request_number"));
    const owner: string = core.getInput("owner");
    const repo: string = core.getInput("repository");
    const mergeMethod: string = core.getInput("merge_method");

    core.info(`owner: ${owner}`);
    core.info(`repository: ${repo}`);
    core.info(`pull_request_number: ${pullRequestNumber}`);
    core.info(`merge_method: ${mergeMethod}`);

    if (pullRequestNumber === 0) {
      errHandler(
        new Error("pull_request_number or pull_request_id must be specified"),
      );
    }

    const client = new GitHubClient(token);
    const resp = await client.findPullRequestId({
      owner,
      repo: repo,
      number: pullRequestNumber,
    });

    const { id, state } = resp ?? ({} as IPullRequest);
    if (state !== "OPEN") {
      core.warning(`target pull request state: ${state}`);
      return;
    }

    core.info(`target pull request id: ${id}`);

    if (id) {
      await client.enableAutoMerge(
        mergeMethod
          ? {
              pullRequestId: id,
              mergeMethod: MergeMethod.valueOf(mergeMethod),
            }
          : { pullRequestId: id },
      );
    }
  } catch (error) {
    errHandler(error);
  }
}

Promise.resolve(run()).catch((error: Error) => {
  core.error(error.stack ? error.stack?.toString() : error);
  core.setFailed(error);
});

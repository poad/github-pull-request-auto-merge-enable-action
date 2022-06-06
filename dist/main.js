import * as core from '@actions/core';
import GitHubClient, { MergeMethod } from './client';
const run = async () => {
    const errHandler = (error) => {
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
        const token = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const pullRequestId = core.getInput('pull_request_id');
        const owner = core.getInput('owner');
        const repo = core.getInput('repository');
        const mergeMethod = core.getInput('merge_method');
        core.info(`owner: ${owner}`);
        core.info(`repository: ${repo}`);
        core.info(`pull_request_number: ${pullRequestNumber}`);
        core.info(`pull_request_id: ${pullRequestId}`);
        core.info(`merge_method: ${mergeMethod}`);
        if (pullRequestNumber === 0 && pullRequestId === undefined) {
            errHandler(new Error('pull_request_number or pull_request_id must be specified'));
        }
        const client = new GitHubClient(token);
        const resp = pullRequestId === undefined
            ? await client.findPullRequestId({
                owner,
                repo: repo,
                number: pullRequestNumber
            })
            : { id: pullRequestId, state: undefined };
        const state = resp !== undefined ? resp.state : undefined;
        if (state !== 'OPEN') {
            core.warning(`target pull request state: ${state}`);
            return;
        }
        const id = resp !== undefined ? resp.id : undefined;
        core.info(`target pull request id: ${id}`);
        if (id !== undefined) {
            await client.enableAutoMerge({
                pullRequestId: id,
                mergeMethod: mergeMethod !== undefined
                    ? MergeMethod.valueOf(mergeMethod)
                    : undefined
            });
        }
    }
    catch (error) {
        errHandler(error);
    }
};
Promise.resolve(run()).catch((error) => {
    core.error(error);
    core.setFailed(error);
});
//# sourceMappingURL=main.js.map
import * as core from '@actions/core'
import GitHubClient, { MergeMethod } from './client';

const run = async (): Promise<void> => {
    const errHandler = (error: unknown) => {
        if (error instanceof Error) {
            core.error(error);
            core.setFailed(error);
            return;
        }
        const e = error instanceof Error ? error : JSON.stringify(error)
        core.error(e);
        core.setFailed(e)
    };
    try {
        const token: string = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const pullRequestId = core.getInput('pull_request_id');
        const owner: string = core.getInput('owner');
        const repo: string = core.getInput('repository');
        const mergeMethod: string = core.getInput('merge_method');

        core.info(`owner: ${owner}`);
        core.info(`repo: ${repo}`);
        core.info(`pullRequestNumber: ${pullRequestNumber}`)
        core.info(`pullRequestId: ${pullRequestId}`)
        core.info(`mergeMethod: ${mergeMethod}`)

        if (pullRequestNumber === 0 && pullRequestId === undefined) {
            errHandler(new Error("pull_request_number or pull_request_id must be specified"))
        }

        const client = new GitHubClient(token);
        const id = pullRequestNumber !== 0 ? await client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber
        }) : pullRequestId;

        core.info(`target pull request id: ${id}`);

        if (id !== undefined) {
            await client.enableAutoMerge({
                pullRequestId: id,
                mergeMethod: mergeMethod !== undefined ? MergeMethod.valueOf(mergeMethod) : undefined
            })
        }
    } catch (error) {
        errHandler(error);
    }
};

Promise.resolve(run()).catch((error: Error) => {
    core.error(error);
    core.setFailed(error)
});
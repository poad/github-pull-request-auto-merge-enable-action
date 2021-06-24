import * as core from '@actions/core'
import GitHubClient from './client';

const run = (): void => {
    const errHandler = (error: Error) => {
        core.error(error.message);
        core.setFailed(error.message)
    };
    try {
        const token: string = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const pullRequestId = core.getInput('pull_request_id');
        const owner: string = core.getInput('owner');
        const repo: string = core.getInput('repository');

        core.info(`owner: ${owner}`);
        core.info(`repo: ${repo}`);
        core.info(`pullRequestNumber: ${pullRequestNumber}`)
        core.info(`pullRequestId: ${pullRequestId}`)

        if (pullRequestNumber === undefined && pullRequestId === undefined) {
            errHandler({
                message: "pull_request_number or pull_request_id must be specified"
            } as Error)
        }

        const client = new GitHubClient(token);
        if (pullRequestNumber !== undefined) {
            Promise.resolve(client.findPullRequestId({
                owner,
                repo: repo,
                number: pullRequestNumber
            }).then(id => {
                if (id !== undefined) {
                    client.enableAutoMerge(id)
                }
            })
                .catch(errHandler)).catch(reason => { throw reason; });
        } else {
            Promise.resolve(client.enableAutoMerge(pullRequestId))
                .catch(reason => { throw reason; });
        }
    } catch (error) {
        errHandler(error);
    }
};

run();
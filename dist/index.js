import * as core from '@actions/core';
import { GraphqlResponseError } from '@octokit/graphql';
import 'source-map-support/register';
import { run } from './main.js';
// error handler
function errHandler(error) {
    if (error instanceof GraphqlResponseError) {
        core.error(
        // eslint-disable-next-line max-len
        'Unable to enable automerge.Enable branch protection and activate one or more "branch protection rules". See https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request#enabling-auto-merge and https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule for more information');
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
async function main() {
    try {
        const token = core.getInput('github_token');
        const pullRequestNumber = Number(core.getInput('pull_request_number'));
        const owner = core.getInput('owner');
        const repo = core.getInput('repository');
        const mergeMethod = core.getInput('merge_method');
        const withApprove = core.getBooleanInput('with_approve');
        core.info(`owner: ${owner}`);
        core.info(`repository: ${repo}`);
        core.info(`pull_request_number: ${pullRequestNumber}`);
        core.info(`merge_method: ${mergeMethod}`);
        if (pullRequestNumber === 0) {
            errHandler(new Error('pull_request_number or pull_request_id must be specified'));
        }
        run({
            token,
            pullRequestNumber,
            owner,
            repo,
            mergeMethod,
            withApprove,
        });
    }
    catch (error) {
        errHandler(error);
    }
}
/// entrypoint
function entrypoint() {
    Promise.resolve(main()).catch((error) => {
        core.error(error.stack ? error.stack?.toString() : error);
        core.setFailed(error);
    });
}
entrypoint();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDeEQsT0FBTyw2QkFBNkIsQ0FBQztBQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWhDLGdCQUFnQjtBQUNoQixTQUFTLFVBQVUsQ0FBQyxLQUFjO0lBQ2hDLElBQUksS0FBSyxZQUFZLG9CQUFvQixFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUs7UUFDUixtQ0FBbUM7UUFDbkMsNGNBQTRjLENBQzdjLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLE9BQU87SUFDVCxDQUFDO0lBQ0QsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLE9BQU87SUFDVCxDQUFDO0lBQ0QsTUFBTSxDQUFDLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLENBQUM7QUFFRCxnQkFBZ0I7QUFDaEIsS0FBSyxVQUFVLElBQUk7SUFDakIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUN2RSxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakQsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRCxNQUFNLFdBQVcsR0FBWSxJQUFJLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWxFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLElBQUksaUJBQWlCLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDNUIsVUFBVSxDQUNSLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQ3RFLENBQUM7UUFDSixDQUFDO1FBRUQsR0FBRyxDQUFDO1lBQ0YsS0FBSztZQUNMLGlCQUFpQjtZQUNqQixLQUFLO1lBQ0wsSUFBSTtZQUNKLFdBQVc7WUFDWCxXQUFXO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQztBQUNILENBQUM7QUFFRCxjQUFjO0FBQ2QsU0FBUyxVQUFVO0lBQ2pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsVUFBVSxFQUFFLENBQUMifQ==
import * as core from "@actions/core";
import { GraphqlResponseError } from "@octokit/graphql";
import "source-map-support/register";
import GitHubClient, { MergeMethod } from "./client.js";
async function run() {
    const errHandler = (error) => {
        if (error instanceof GraphqlResponseError) {
            core.error('Unable to enable automerge.Enable branch protection and activate one or more "branch protection rules". See https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request#enabling-auto-merge and https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule for more information');
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
        const token = core.getInput("github_token");
        const pullRequestNumber = Number(core.getInput("pull_request_number"));
        const owner = core.getInput("owner");
        const repo = core.getInput("repository");
        const mergeMethod = core.getInput("merge_method");
        core.info(`owner: ${owner}`);
        core.info(`repository: ${repo}`);
        core.info(`pull_request_number: ${pullRequestNumber}`);
        core.info(`merge_method: ${mergeMethod}`);
        if (pullRequestNumber === 0) {
            errHandler(new Error("pull_request_number or pull_request_id must be specified"));
        }
        const client = new GitHubClient(token);
        const resp = await client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber,
        });
        const { id, state } = resp ?? {};
        if (state !== "OPEN") {
            core.warning(`target pull request state: ${state}`);
            return;
        }
        core.info(`target pull request id: ${id}`);
        if (id) {
            await client.enableAutoMerge(mergeMethod
                ? {
                    pullRequestId: id,
                    mergeMethod: MergeMethod.valueOf(mergeMethod),
                }
                : { pullRequestId: id });
        }
    }
    catch (error) {
        errHandler(error);
    }
}
Promise.resolve(run()).catch((error) => {
    core.error(error.stack ? error.stack?.toString() : error);
    core.setFailed(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hELE9BQU8sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxZQUFZLEVBQUUsRUFBcUIsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRTNFLEtBQUssVUFBVSxHQUFHO0lBQ2hCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBYyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxLQUFLLFlBQVksb0JBQW9CLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsS0FBSyxDQUNSLDRjQUE0YyxDQUM3YyxDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPO1FBQ1QsQ0FBQztRQUNELElBQUksS0FBSyxZQUFZLEtBQUssRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPO1FBQ1QsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUM7SUFDRixJQUFJLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0saUJBQWlCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNqRCxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTFELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLElBQUksaUJBQWlCLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDNUIsVUFBVSxDQUNSLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQ3RFLENBQUM7UUFDSixDQUFDO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUM7WUFDMUMsS0FBSztZQUNMLElBQUksRUFBRSxJQUFJO1lBQ1YsTUFBTSxFQUFFLGlCQUFpQjtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksSUFBSyxFQUFtQixDQUFDO1FBQ25ELElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsOEJBQThCLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDcEQsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDUCxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQzFCLFdBQVc7Z0JBQ1QsQ0FBQyxDQUFDO29CQUNFLGFBQWEsRUFBRSxFQUFFO29CQUNqQixXQUFXLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7aUJBQzlDO2dCQUNILENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FDMUIsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQztBQUVELE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMifQ==
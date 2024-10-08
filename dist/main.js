import * as core from '@actions/core';
import 'source-map-support/register';
import GitHubClient from './client.js';
/// domain logic
export async function run({ token, owner, repo, pullRequestNumber, mergeMethod, withApprove, }) {
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
            const approver = withApprove && reviews.nodes.length > 0
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
            await approver().then(async () => await client.enableAutoMerge(mergeMethod
                ? {
                    pullRequestId: id,
                    mergeMethod: mergeMethod,
                }
                : { pullRequestId: id }));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sNkJBQTZCLENBQUM7QUFDckMsT0FBTyxZQUFrQyxNQUFNLGFBQWEsQ0FBQztBQVc3RCxnQkFBZ0I7QUFDaEIsTUFBTSxDQUFDLEtBQUssVUFBVSxHQUFHLENBQUMsRUFDeEIsS0FBSyxFQUNMLEtBQUssRUFDTCxJQUFJLEVBQ0osaUJBQWlCLEVBQ2pCLFdBQVcsRUFDWCxXQUFXLEdBQ0o7SUFDUCxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQ2hCLFFBQVEsV0FBVyxFQUFFLENBQUM7WUFDcEIsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssUUFBUTtnQkFDWCxLQUFLO2dCQUNMLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdEIsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV2QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUMxQyxLQUFLO1FBQ0wsSUFBSTtRQUNKLE1BQU0sRUFBRSxpQkFBaUI7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNULE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNwQyxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLDhCQUE4QixLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ1AsTUFBTSxRQUFRLEdBQ1osV0FBVyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDWCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDckMsTUFBTSxDQUFDLHdCQUF3QixDQUFDO3dCQUM5QixhQUFhLEVBQUUsRUFBRTt3QkFDakIsUUFBUTtxQkFDVCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ1gsT0FBTztnQkFDVCxDQUFDLENBQUM7WUFFTixNQUFNLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FDbkIsS0FBSyxJQUFJLEVBQUUsQ0FDVCxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQzFCLFdBQVc7Z0JBQ1QsQ0FBQyxDQUFDO29CQUNBLGFBQWEsRUFBRSxFQUFFO29CQUNqQixXQUFXLEVBQUUsV0FBMEI7aUJBQ3hDO2dCQUNELENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FDMUIsQ0FDSixDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIn0=
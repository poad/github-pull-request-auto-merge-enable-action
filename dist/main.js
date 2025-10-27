import * as core from '@actions/core';
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
            if (withApprove && reviews.nodes.length > 0) {
                const reviewId = reviews.nodes[0].id;
                client.approvePullRequestReview({
                    pullRequestId: id,
                    reviewId,
                });
                await client.enableAutoMerge({
                    pullRequestId: id,
                    ...(mergeMethod ? { mergeMethod: mergeMethod } : {}),
                });
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sWUFBa0MsTUFBTSxhQUFhLENBQUM7QUFXN0QsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQ3hCLEtBQUssRUFDTCxLQUFLLEVBQ0wsSUFBSSxFQUNKLGlCQUFpQixFQUNqQixXQUFXLEVBQ1gsV0FBVyxHQUNKO0lBQ1AsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNoQixRQUFRLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFFBQVE7Z0JBQ1gsS0FBSztnQkFDTCxNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDMUMsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNLEVBQUUsaUJBQWlCO0tBQzFCLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxFQUFFLENBQUM7UUFDVCxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEMsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRCxPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0MsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNQLElBQUksV0FBVyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUM1QyxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxDQUFDLHdCQUF3QixDQUFDO29CQUM5QixhQUFhLEVBQUUsRUFBRTtvQkFDakIsUUFBUTtpQkFDVCxDQUFDLENBQUM7Z0JBQ0gsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUMxQjtvQkFDRSxhQUFhLEVBQUUsRUFBRTtvQkFDakIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsV0FBMEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQ3BFLENBQ0YsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUMifQ==
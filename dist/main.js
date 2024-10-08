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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sWUFBa0MsTUFBTSxhQUFhLENBQUM7QUFXN0QsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQ3hCLEtBQUssRUFDTCxLQUFLLEVBQ0wsSUFBSSxFQUNKLGlCQUFpQixFQUNqQixXQUFXLEVBQ1gsV0FBVyxHQUNKO0lBQ1AsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNoQixRQUFRLFdBQVcsRUFBRSxDQUFDO1lBQ3BCLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFFBQVE7Z0JBQ1gsS0FBSztnQkFDTCxNQUFNO1lBQ1I7Z0JBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDMUMsS0FBSztRQUNMLElBQUk7UUFDSixNQUFNLEVBQUUsaUJBQWlCO0tBQzFCLENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxFQUFFLENBQUM7UUFDVCxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEMsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRCxPQUFPO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0MsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNQLE1BQU0sUUFBUSxHQUNaLFdBQVcsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNyQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7b0JBQ1gsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ3JDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQzt3QkFDOUIsYUFBYSxFQUFFLEVBQUU7d0JBQ2pCLFFBQVE7cUJBQ1QsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO29CQUNYLE9BQU87Z0JBQ1QsQ0FBQyxDQUFDO1lBRU4sTUFBTSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQ25CLEtBQUssSUFBSSxFQUFFLENBQ1QsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUMxQixXQUFXO2dCQUNULENBQUMsQ0FBQztvQkFDQSxhQUFhLEVBQUUsRUFBRTtvQkFDakIsV0FBVyxFQUFFLFdBQTBCO2lCQUN4QztnQkFDRCxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQzFCLENBQ0osQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyJ9
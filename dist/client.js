import * as core from '@actions/core';
import { graphql } from '@octokit/graphql';
import 'source-map-support/register';
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async approvePullRequestReview({ pullRequestId, reviewId, }) {
        const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          mergeMethod: "${reviewId}"
        }) {
          clientMutationId
          pullRequestReview
        }
      }
      `;
        core.debug(`execute graphql mutation ${query}`);
        await graphql(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
            request: {
                fetch,
            },
        });
    }
    async findPullRequestId({ owner, repo, number, }) {
        const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          id
          state
          reviews(last: 1) {
            nodes {
              id
            }
          }
        }
      }
    }
    `;
        const response = await graphql(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
            request: {
                fetch,
            },
        });
        core.debug(`response: ${response ? JSON.stringify(response) : undefined}`);
        return response?.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod, }) {
        const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod ? `mergeMethod: ${mergeMethod.toString()}` : ''}
        }) {
          clientMutationId
        }
      }
      `;
        core.debug(`execute graphql mutation ${query}`);
        await graphql(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
            request: {
                fetch,
            },
        });
    }
}
export default GitHubClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDM0MsT0FBTyw2QkFBNkIsQ0FBQztBQTRDckMsTUFBTSxZQUFZO0lBQ1IsS0FBSyxDQUFTO0lBRXRCLFlBQVksS0FBYTtRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLHdCQUF3QixDQUFDLEVBQzdCLGFBQWEsRUFDYixRQUFRLEdBQ3NCO1FBQzlCLE1BQU0sS0FBSyxHQUFHOzs7NEJBR1UsYUFBYTswQkFDZixRQUFROzs7Ozs7T0FNM0IsQ0FBQztRQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdEIsS0FBSyxFQUNMLElBQUksRUFDSixNQUFNLEdBQ2lCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHOzsyQkFFUyxLQUFLLGFBQWEsSUFBSTs4QkFDbkIsTUFBTTs7Ozs7Ozs7Ozs7S0FXL0IsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUF1QixLQUFLLEVBQUU7WUFDMUQsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSzthQUNOO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUUzRSxPQUFPLFFBQVEsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQ3BCLGFBQWEsRUFDYixXQUFXLEdBQ1U7UUFDckIsTUFBTSxLQUFLLEdBQUc7Ozs0QkFHVSxhQUFhO1lBQzdCLFdBQVcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7OztPQUtoRSxDQUFDO1FBRUosSUFBSSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRCxNQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSzthQUNOO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsZUFBZSxZQUFZLENBQUMifQ==
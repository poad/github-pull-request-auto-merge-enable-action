import * as core from '@actions/core';
import { graphql } from '@octokit/graphql';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUE0QzNDLE1BQU0sWUFBWTtJQUNSLEtBQUssQ0FBUztJQUV0QixZQUFZLEtBQWE7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxFQUM3QixhQUFhLEVBQ2IsUUFBUSxHQUNzQjtRQUM5QixNQUFNLEtBQUssR0FBRzs7OzRCQUdVLGFBQWE7MEJBQ2YsUUFBUTs7Ozs7O09BTTNCLENBQUM7UUFFSixJQUFJLENBQUMsS0FBSyxDQUFDLDRCQUE0QixLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1AsYUFBYSxFQUFFLFNBQVMsSUFBSSxDQUFDLEtBQUssRUFBRTthQUNyQztZQUNELE9BQU8sRUFBRTtnQkFDUCxLQUFLO2FBQ047U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQ3RCLEtBQUssRUFDTCxJQUFJLEVBQ0osTUFBTSxHQUNpQjtRQUN2QixNQUFNLEtBQUssR0FBRzs7MkJBRVMsS0FBSyxhQUFhLElBQUk7OEJBQ25CLE1BQU07Ozs7Ozs7Ozs7O0tBVy9CLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBdUIsS0FBSyxFQUFFO1lBQzFELE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFM0UsT0FBTyxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQztJQUMzQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUNwQixhQUFhLEVBQ2IsV0FBVyxHQUNVO1FBQ3JCLE1BQU0sS0FBSyxHQUFHOzs7NEJBR1UsYUFBYTtZQUM3QixXQUFXLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7T0FLaEUsQ0FBQztRQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGVBQWUsWUFBWSxDQUFDIn0=
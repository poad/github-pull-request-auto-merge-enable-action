import * as core from "@actions/core";
import { graphql } from "@octokit/graphql";
import "source-map-support/register";
export var MergeMethod;
(function (MergeMethod) {
    MergeMethod["MERGE"] = "MERGE";
    MergeMethod["REBASE"] = "REBASE";
    MergeMethod["SQUASH"] = "SQUASH";
})(MergeMethod || (MergeMethod = {}));
(function (MergeMethod) {
    const reverseMap = new Map();
    // biome-ignore lint/complexity/noForEach: reason
    Object.keys(MergeMethod).forEach((s) => {
        // biome-ignore lint/suspicious/noExplicitAny: reason
        const e = MergeMethod[s];
        reverseMap.set(e.toString(), e);
    });
    // biome-ignore lint/suspicious/noShadowRestrictedNames: reason
    function valueOf(str) {
        return reverseMap.get(str);
    }
    MergeMethod.valueOf = valueOf;
})(MergeMethod || (MergeMethod = {}));
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async findPullRequestId({ owner, repo, number, }) {
        const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          id
          state
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
        return response.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod, }) {
        const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod ? `mergeMethod: ${mergeMethod.toString()}` : ""}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDM0MsT0FBTyw2QkFBNkIsQ0FBQztBQUVyQyxNQUFNLENBQU4sSUFBWSxXQUlYO0FBSkQsV0FBWSxXQUFXO0lBQ3JCLDhCQUFlLENBQUE7SUFDZixnQ0FBaUIsQ0FBQTtJQUNqQixnQ0FBaUIsQ0FBQTtBQUNuQixDQUFDLEVBSlcsV0FBVyxLQUFYLFdBQVcsUUFJdEI7QUFFRCxXQUFpQixXQUFXO0lBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFDO0lBQ2xELGlEQUFpRDtJQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO1FBQzdDLHFEQUFxRDtRQUNyRCxNQUFNLENBQUMsR0FBUyxXQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDSCwrREFBK0Q7SUFDL0QsU0FBZ0IsT0FBTyxDQUFDLEdBQVc7UUFDakMsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFGZSxtQkFBTyxVQUV0QixDQUFBO0FBQ0gsQ0FBQyxFQVpnQixXQUFXLEtBQVgsV0FBVyxRQVkzQjtBQStCRCxNQUFNLFlBQVk7SUFDUixLQUFLLENBQVM7SUFFdEIsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdEIsS0FBSyxFQUNMLElBQUksRUFDSixNQUFNLEdBQ2lCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHOzsyQkFFUyxLQUFLLGFBQWEsSUFBSTs4QkFDbkIsTUFBTTs7Ozs7O0tBTS9CLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBdUIsS0FBSyxFQUFFO1lBQzFELE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFM0UsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUNwQixhQUFhLEVBQ2IsV0FBVyxHQUNVO1FBQ3JCLE1BQU0sS0FBSyxHQUFHOzs7NEJBR1UsYUFBYTtZQUM3QixXQUFXLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7T0FLaEUsQ0FBQztRQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGVBQWUsWUFBWSxDQUFDIn0=
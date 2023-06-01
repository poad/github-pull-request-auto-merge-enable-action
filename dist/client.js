"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeMethod = void 0;
const graphql_1 = require("@octokit/graphql");
const core = __importStar(require("@actions/core"));
require("source-map-support/register");
var MergeMethod;
(function (MergeMethod) {
    MergeMethod["MERGE"] = "MERGE";
    MergeMethod["REBASE"] = "REBASE";
    MergeMethod["SQUASH"] = "SQUASH";
})(MergeMethod || (exports.MergeMethod = MergeMethod = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace
(function (MergeMethod) {
    const reverseMap = new Map();
    Object.keys(MergeMethod).forEach((s) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = MergeMethod[s];
        reverseMap.set(e.toString(), e);
    });
    function valueOf(str) {
        return reverseMap.get(str);
    }
    MergeMethod.valueOf = valueOf;
})(MergeMethod || (exports.MergeMethod = MergeMethod = {}));
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async findPullRequestId({ owner, repo, number }) {
        const query = `
    query {
      repository(owner: "${owner}", name: "${repo}") {
        pullRequest(number: ${number}) {
          id,
          state
        }
      }
    }
    `;
        const { data } = await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
        core.debug(JSON.stringify(data));
        return data?.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod }) {
        const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod
            ? `mergeMethod: ${mergeMethod.toString()}`
            : ''}
          clientMutationId : null
        }) {
          clientMutationId
        }
      }
      `;
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QztBQUN4QyxvREFBcUM7QUFDckMsdUNBQW9DO0FBRXBDLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNyQiw4QkFBZSxDQUFBO0lBQ2YsZ0NBQWlCLENBQUE7SUFDakIsZ0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLFdBQVcsMkJBQVgsV0FBVyxRQUl0QjtBQUVELDJEQUEyRDtBQUMzRCxXQUFpQixXQUFXO0lBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFBO0lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDN0MsOERBQThEO1FBQzlELE1BQU0sQ0FBQyxHQUFTLFdBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNGLFNBQWdCLE9BQU8sQ0FBQyxHQUFXO1FBQ2pDLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRmUsbUJBQU8sVUFFdEIsQ0FBQTtBQUNILENBQUMsRUFWZ0IsV0FBVywyQkFBWCxXQUFXLFFBVTNCO0FBaUNELE1BQU0sWUFBWTtJQUNSLEtBQUssQ0FBUTtJQUVyQixZQUFZLEtBQWE7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUNELEtBQUssQ0FBQyxpQkFBaUIsQ0FDckIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBeUI7UUFFOUMsTUFBTSxLQUFLLEdBQUc7OzJCQUVTLEtBQUssYUFBYSxJQUFJOzhCQUNuQixNQUFNOzs7Ozs7S0FNL0IsQ0FBQTtRQUNELE1BQU0sRUFBQyxJQUFJLEVBQUMsR0FBRyxNQUFNLElBQUEsaUJBQU8sRUFBdUIsS0FBSyxFQUFFO1lBQ3hELE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFFaEMsT0FBTyxJQUFJLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQXdCO1FBQ3hFLE1BQU0sS0FBSyxHQUFHOzs7NEJBR1UsYUFBYTtZQUU3QixXQUFXO1lBQ1QsQ0FBQyxDQUFDLGdCQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDMUMsQ0FBQyxDQUFDLEVBQ047Ozs7OztPQU1ILENBQUE7UUFDSCxNQUFNLElBQUEsaUJBQU8sRUFBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxZQUFZLENBQUEifQ==
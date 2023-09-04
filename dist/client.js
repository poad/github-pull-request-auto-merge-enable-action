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
          id
          state
        }
      }
    }
    `;
        const response = await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            },
            request: {
                fetch
            }
        });
        core.debug(`response: ${response ? JSON.stringify(response) : undefined}`);
        return response.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod }) {
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
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            },
            request: {
                fetch
            }
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QztBQUN4QyxvREFBcUM7QUFDckMsdUNBQW9DO0FBRXBDLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNyQiw4QkFBZSxDQUFBO0lBQ2YsZ0NBQWlCLENBQUE7SUFDakIsZ0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLFdBQVcsMkJBQVgsV0FBVyxRQUl0QjtBQUVELDJEQUEyRDtBQUMzRCxXQUFpQixXQUFXO0lBQzFCLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUF1QixDQUFBO0lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDN0MsOERBQThEO1FBQzlELE1BQU0sQ0FBQyxHQUFTLFdBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUMvQixVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNGLFNBQWdCLE9BQU8sQ0FBQyxHQUFXO1FBQ2pDLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRmUsbUJBQU8sVUFFdEIsQ0FBQTtBQUNILENBQUMsRUFWZ0IsV0FBVywyQkFBWCxXQUFXLFFBVTNCO0FBK0JELE1BQU0sWUFBWTtJQUNSLEtBQUssQ0FBUTtJQUVyQixZQUFZLEtBQWE7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUNELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUN0QixLQUFLLEVBQ0wsSUFBSSxFQUNKLE1BQU0sRUFDaUI7UUFDdkIsTUFBTSxLQUFLLEdBQUc7OzJCQUVTLEtBQUssYUFBYSxJQUFJOzhCQUNuQixNQUFNOzs7Ozs7S0FNL0IsQ0FBQTtRQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxpQkFBTyxFQUF1QixLQUFLLEVBQUU7WUFDMUQsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSzthQUNOO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUUxRSxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFBO0lBQ3pDLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQ3BCLGFBQWEsRUFDYixXQUFXLEVBQ1U7UUFDckIsTUFBTSxLQUFLLEdBQUc7Ozs0QkFHVSxhQUFhO1lBQzdCLFdBQVcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7OztPQUtoRSxDQUFBO1FBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUMvQyxNQUFNLElBQUEsaUJBQU8sRUFBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSzthQUNOO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFBIn0=
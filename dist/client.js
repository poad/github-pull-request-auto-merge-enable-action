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
})(MergeMethod = exports.MergeMethod || (exports.MergeMethod = {}));
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
})(MergeMethod = exports.MergeMethod || (exports.MergeMethod = {}));
class GitHubClient {
    token;
    constructor(token) {
        this.token = token;
    }
    async findPullRequestId({ owner, repo, number }) {
        const query = `
    query ($owner: String!, $repo: String!, $number: number!, ) {
      repository(owner: "$owner", name: "$repo") {
        pullRequest(number: $number) {
          id,
          state
        }
      }
    },
    variables: {
      "owner": "${owner}",
      "repo": "${repo}",
      "number": ${number},
    }
    `;
        const { data } = await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            }
        });
        core.debug(JSON.stringify(data));
        return data.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod }) {
        const query = `
      mutation ($pullRequestId: String!) {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "$pullRequestId",
          ${mergeMethod
            ? `mergeMethod: ${mergeMethod.toString()}`
            : ''}
          clientMutationId : null
        }) {
          clientMutationId
        }
      },
      variables: {
        "pullRequestId": "${pullRequestId}"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QztBQUN4QyxvREFBcUM7QUFDckMsdUNBQW9DO0FBRXBDLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNyQiw4QkFBZSxDQUFBO0lBQ2YsZ0NBQWlCLENBQUE7SUFDakIsZ0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBSXRCO0FBRUQsMkRBQTJEO0FBQzNELFdBQWlCLFdBQVc7SUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUE7SUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRTtRQUM3Qyw4REFBOEQ7UUFDOUQsTUFBTSxDQUFDLEdBQVMsV0FBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQy9CLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ2pDLENBQUMsQ0FBQyxDQUFBO0lBQ0YsU0FBZ0IsT0FBTyxDQUFDLEdBQVc7UUFDakMsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFGZSxtQkFBTyxVQUV0QixDQUFBO0FBQ0gsQ0FBQyxFQVZnQixXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQVUzQjtBQWlDRCxNQUFNLFlBQVk7SUFDUixLQUFLLENBQVE7SUFFckIsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLENBQUM7SUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQ3JCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQXlCO1FBRTlDLE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7O2tCQVVBLEtBQUs7aUJBQ04sSUFBSTtrQkFDSCxNQUFNOztLQUVuQixDQUFBO1FBQ0QsTUFBTSxFQUFDLElBQUksRUFBQyxHQUFHLE1BQU0sSUFBQSxpQkFBTyxFQUF1QixLQUFLLEVBQUU7WUFDeEQsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7U0FDRixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUVoQyxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFBO0lBQ3JDLENBQUM7SUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBd0I7UUFDeEUsTUFBTSxLQUFLLEdBQUc7Ozs7WUFLTixXQUFXO1lBQ1QsQ0FBQyxDQUFDLGdCQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDMUMsQ0FBQyxDQUFDLEVBQ047Ozs7Ozs7NEJBT2tCLGFBQWE7O09BRWxDLENBQUE7UUFDSCxNQUFNLElBQUEsaUJBQU8sRUFBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7YUFDckM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxZQUFZLENBQUEifQ==
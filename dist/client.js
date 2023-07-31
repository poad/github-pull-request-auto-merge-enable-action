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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeMethod = void 0;
const graphql_1 = require("@octokit/graphql");
const core = __importStar(require("@actions/core"));
const node_fetch_1 = __importDefault(require("node-fetch"));
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
                fetch: node_fetch_1.default
            }
        });
        core.debug(`response: ${response ? JSON.stringify(response) : undefined}`);
        const { data } = response;
        core.debug(JSON.stringify(data));
        return data?.repository?.pullRequest;
    }
    async enableAutoMerge({ pullRequestId, mergeMethod }) {
        const query = `
      mutation  {
        enablePullRequestAutoMerge(input: {
          pullRequestId: "${pullRequestId}",
          ${mergeMethod ? `mergeMethod: ${mergeMethod.toString()}` : ''}
          clientMutationId : null
        }) {
          clientMutationId
        }
      }
      `;
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`
            },
            request: {
                fetch: node_fetch_1.default
            }
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUF3QztBQUN4QyxvREFBcUM7QUFDckMsNERBQThCO0FBQzlCLHVDQUFvQztBQUVwQyxJQUFZLFdBSVg7QUFKRCxXQUFZLFdBQVc7SUFDckIsOEJBQWUsQ0FBQTtJQUNmLGdDQUFpQixDQUFBO0lBQ2pCLGdDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFKVyxXQUFXLDJCQUFYLFdBQVcsUUFJdEI7QUFFRCwyREFBMkQ7QUFDM0QsV0FBaUIsV0FBVztJQUMxQixNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBdUIsQ0FBQTtJQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFO1FBQzdDLDhEQUE4RDtRQUM5RCxNQUFNLENBQUMsR0FBUyxXQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0IsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDakMsQ0FBQyxDQUFDLENBQUE7SUFDRixTQUFnQixPQUFPLENBQUMsR0FBVztRQUNqQyxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQUZlLG1CQUFPLFVBRXRCLENBQUE7QUFDSCxDQUFDLEVBVmdCLFdBQVcsMkJBQVgsV0FBVyxRQVUzQjtBQWlDRCxNQUFNLFlBQVk7SUFDUixLQUFLLENBQVE7SUFFckIsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0lBQ3BCLENBQUM7SUFDRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdEIsS0FBSyxFQUNMLElBQUksRUFDSixNQUFNLEVBQ2lCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHOzsyQkFFUyxLQUFLLGFBQWEsSUFBSTs4QkFDbkIsTUFBTTs7Ozs7O0tBTS9CLENBQUE7UUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsaUJBQU8sRUFBdUIsS0FBSyxFQUFFO1lBQzFELE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBTCxvQkFBSzthQUNOO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUUxRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFBO1FBRXpCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRWhDLE9BQU8sSUFBSSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUE7SUFDdEMsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsRUFDcEIsYUFBYSxFQUNiLFdBQVcsRUFDVTtRQUNyQixNQUFNLEtBQUssR0FBRzs7OzRCQUdVLGFBQWE7WUFDN0IsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7Ozs7OztPQU1oRSxDQUFBO1FBQ0gsTUFBTSxJQUFBLGlCQUFPLEVBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBTCxvQkFBSzthQUNOO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFBIn0=
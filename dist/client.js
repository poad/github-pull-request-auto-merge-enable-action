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
const core = __importStar(require("@actions/core"));
const graphql_1 = require("@octokit/graphql");
require("source-map-support/register");
var MergeMethod;
(function (MergeMethod) {
    MergeMethod["MERGE"] = "MERGE";
    MergeMethod["REBASE"] = "REBASE";
    MergeMethod["SQUASH"] = "SQUASH";
})(MergeMethod || (exports.MergeMethod = MergeMethod = {}));
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
})(MergeMethod || (exports.MergeMethod = MergeMethod = {}));
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
        const response = await (0, graphql_1.graphql)(query, {
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
        await (0, graphql_1.graphql)(query, {
            headers: {
                authorization: `token ${this.token}`,
            },
            request: {
                fetch,
            },
        });
    }
}
exports.default = GitHubClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFzQztBQUN0Qyw4Q0FBMkM7QUFDM0MsdUNBQXFDO0FBRXJDLElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUNyQiw4QkFBZSxDQUFBO0lBQ2YsZ0NBQWlCLENBQUE7SUFDakIsZ0NBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQUpXLFdBQVcsMkJBQVgsV0FBVyxRQUl0QjtBQUVELFdBQWlCLFdBQVc7SUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7SUFDbEQsaURBQWlEO0lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUU7UUFDN0MscURBQXFEO1FBQ3JELE1BQU0sQ0FBQyxHQUFTLFdBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNILCtEQUErRDtJQUMvRCxTQUFnQixPQUFPLENBQUMsR0FBVztRQUNqQyxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUZlLG1CQUFPLFVBRXRCLENBQUE7QUFDSCxDQUFDLEVBWmdCLFdBQVcsMkJBQVgsV0FBVyxRQVkzQjtBQStCRCxNQUFNLFlBQVk7SUFDUixLQUFLLENBQVM7SUFFdEIsWUFBWSxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFDdEIsS0FBSyxFQUNMLElBQUksRUFDSixNQUFNLEdBQ2lCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHOzsyQkFFUyxLQUFLLGFBQWEsSUFBSTs4QkFDbkIsTUFBTTs7Ozs7O0tBTS9CLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsaUJBQU8sRUFBdUIsS0FBSyxFQUFFO1lBQzFELE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFM0UsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQztJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUNwQixhQUFhLEVBQ2IsV0FBVyxHQUNVO1FBQ3JCLE1BQU0sS0FBSyxHQUFHOzs7NEJBR1UsYUFBYTtZQUM3QixXQUFXLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7T0FLaEUsQ0FBQztRQUVKLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEQsTUFBTSxJQUFBLGlCQUFPLEVBQUMsS0FBSyxFQUFFO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO2FBQ3JDO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUs7YUFDTjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLFlBQVksQ0FBQyJ9
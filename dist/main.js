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
exports.run = run;
const core = __importStar(require("@actions/core"));
require("source-map-support/register");
const client_js_1 = __importDefault(require("./client.js"));
/// domain logic
async function run({ token, owner, repo, pullRequestNumber, mergeMethod, withApprove, }) {
    if (mergeMethod) {
        switch (mergeMethod) {
            case "MERGE":
            case "REBASE":
            case "SQUASH":
                // OK
                break;
            default:
                core.error(`Unsupported Merge Method: ${mergeMethod}`);
                throw new Error();
        }
    }
    const client = new client_js_1.default(token);
    const resp = await client.findPullRequestId({
        owner,
        repo,
        number: pullRequestNumber,
    });
    if (resp) {
        const { id, state, reviews } = resp;
        if (state !== "OPEN") {
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
                : async () => { };
            await approver().then(async () => await client.enableAutoMerge(mergeMethod
                ? {
                    pullRequestId: id,
                    mergeMethod: mergeMethod,
                }
                : { pullRequestId: id }));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxrQkErREM7QUE3RUQsb0RBQXNDO0FBQ3RDLHVDQUFxQztBQUNyQyw0REFBZ0Y7QUFXaEYsZ0JBQWdCO0FBQ1QsS0FBSyxVQUFVLEdBQUcsQ0FBQyxFQUN4QixLQUFLLEVBQ0wsS0FBSyxFQUNMLElBQUksRUFDSixpQkFBaUIsRUFDakIsV0FBVyxFQUNYLFdBQVcsR0FDSjtJQUNQLElBQUksV0FBVyxFQUFFLENBQUM7UUFDaEIsUUFBUSxXQUFXLEVBQUUsQ0FBQztZQUNwQixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxRQUFRO2dCQUNYLEtBQUs7Z0JBQ0wsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTZCLFdBQVcsRUFBRSxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELE1BQU0sTUFBTSxHQUFHLElBQUksbUJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV2QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztRQUMxQyxLQUFLO1FBQ0wsSUFBSTtRQUNKLE1BQU0sRUFBRSxpQkFBaUI7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNULE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNwQyxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLDhCQUE4QixLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELE9BQU87UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQ1AsTUFBTSxRQUFRLEdBQ1osV0FBVyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtvQkFDVCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDckMsTUFBTSxDQUFDLHdCQUF3QixDQUFDO3dCQUM5QixhQUFhLEVBQUUsRUFBRTt3QkFDakIsUUFBUTtxQkFDVCxDQUFDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDSCxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsR0FBRSxDQUFDLENBQUM7WUFFckIsTUFBTSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQ25CLEtBQUssSUFBSSxFQUFFLENBQ1QsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUMxQixXQUFXO2dCQUNULENBQUMsQ0FBQztvQkFDRSxhQUFhLEVBQUUsRUFBRTtvQkFDakIsV0FBVyxFQUFFLFdBQTBCO2lCQUN4QztnQkFDSCxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQzFCLENBQ0osQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyJ9
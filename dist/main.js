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
const core = __importStar(require("@actions/core"));
const graphql_1 = require("@octokit/graphql");
require("source-map-support/register");
const client_1 = __importStar(require("./client"));
async function run() {
    const errHandler = (error) => {
        if (error instanceof graphql_1.GraphqlResponseError) {
            core.error('Unable to enable automerge.Enable branch protection and activate one or more "branch protection rules". See https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request#enabling-auto-merge and https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule for more information');
            core.setFailed(error);
            return;
        }
        if (error instanceof Error) {
            core.error(error);
            core.setFailed(error);
            return;
        }
        const e = error instanceof Error ? error : JSON.stringify(error);
        core.error(e);
        core.setFailed(e);
    };
    try {
        const token = core.getInput("github_token");
        const pullRequestNumber = Number(core.getInput("pull_request_number"));
        const owner = core.getInput("owner");
        const repo = core.getInput("repository");
        const mergeMethod = core.getInput("merge_method");
        core.info(`owner: ${owner}`);
        core.info(`repository: ${repo}`);
        core.info(`pull_request_number: ${pullRequestNumber}`);
        core.info(`merge_method: ${mergeMethod}`);
        if (pullRequestNumber === 0) {
            errHandler(new Error("pull_request_number or pull_request_id must be specified"));
        }
        const client = new client_1.default(token);
        const resp = await client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber,
        });
        const { id, state } = resp ?? {};
        if (state !== "OPEN") {
            core.warning(`target pull request state: ${state}`);
            return;
        }
        core.info(`target pull request id: ${id}`);
        if (id) {
            await client.enableAutoMerge(mergeMethod
                ? {
                    pullRequestId: id,
                    mergeMethod: client_1.MergeMethod.valueOf(mergeMethod),
                }
                : { pullRequestId: id });
        }
    }
    catch (error) {
        errHandler(error);
    }
}
Promise.resolve(run()).catch((error) => {
    core.error(error.stack ? error.stack?.toString() : error);
    core.setFailed(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBc0M7QUFDdEMsOENBQXdEO0FBQ3hELHVDQUFxQztBQUNyQyxtREFBd0U7QUFFeEUsS0FBSyxVQUFVLEdBQUc7SUFDaEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFjLEVBQUUsRUFBRTtRQUNwQyxJQUFJLEtBQUssWUFBWSw4QkFBb0IsRUFBRSxDQUFDO1lBQzFDLElBQUksQ0FBQyxLQUFLLENBQ1IsNGNBQTRjLENBQzdjLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsS0FBSyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGLElBQUksQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFMUMsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM1QixVQUFVLENBQ1IsSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FDdEUsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsaUJBQWlCLENBQUM7WUFDMUMsS0FBSztZQUNMLElBQUksRUFBRSxJQUFJO1lBQ1YsTUFBTSxFQUFFLGlCQUFpQjtTQUMxQixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksSUFBSyxFQUFtQixDQUFDO1FBQ25ELElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsOEJBQThCLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDcEQsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksRUFBRSxFQUFFLENBQUM7WUFDUCxNQUFNLE1BQU0sQ0FBQyxlQUFlLENBQzFCLFdBQVc7Z0JBQ1QsQ0FBQyxDQUFDO29CQUNFLGFBQWEsRUFBRSxFQUFFO29CQUNqQixXQUFXLEVBQUUsb0JBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2lCQUM5QztnQkFDSCxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQzFCLENBQUM7UUFDSixDQUFDO0lBQ0gsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQztBQUNILENBQUM7QUFFRCxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7SUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQyxDQUFDIn0=
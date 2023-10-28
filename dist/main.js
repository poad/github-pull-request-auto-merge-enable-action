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
const run = async () => {
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
        const { id, state } = resp || {};
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
};
Promise.resolve(run()).catch((error) => {
    core.error(error.stack ? error.stack?.toString() : error);
    core.setFailed(error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBc0M7QUFDdEMsOENBQXdEO0FBQ3hELHVDQUFxQztBQUNyQyxtREFBbUU7QUFFbkUsTUFBTSxHQUFHLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBQ3BDLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBYyxFQUFFLEVBQUU7UUFDcEMsSUFBSSxLQUFLLFlBQVksOEJBQW9CLEVBQUU7WUFDekMsSUFBSSxDQUFDLEtBQUssQ0FDUiw0Y0FBNGMsQ0FDN2MsQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixPQUFPO1NBQ1I7UUFDRCxNQUFNLENBQUMsR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDO0lBQ0YsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsTUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFDdkUsTUFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFFMUMsSUFBSSxpQkFBaUIsS0FBSyxDQUFDLEVBQUU7WUFDM0IsVUFBVSxDQUNSLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQ3RFLENBQUM7U0FDSDtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2QyxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztZQUMxQyxLQUFLO1lBQ0wsSUFBSSxFQUFFLElBQUk7WUFDVixNQUFNLEVBQUUsaUJBQWlCO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxJQUFLLEVBQW1CLENBQUM7UUFDbkQsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMsOEJBQThCLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDcEQsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUUzQyxJQUFJLEVBQUUsRUFBRTtZQUNOLE1BQU0sTUFBTSxDQUFDLGVBQWUsQ0FDMUIsV0FBVztnQkFDVCxDQUFDLENBQUM7b0JBQ0UsYUFBYSxFQUFFLEVBQUU7b0JBQ2pCLFdBQVcsRUFBRSxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7aUJBQzlDO2dCQUNILENBQUMsQ0FBQyxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsQ0FDMUIsQ0FBQztTQUNIO0tBQ0Y7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQjtBQUNILENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFDLENBQUMifQ==
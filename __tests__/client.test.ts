import "source-map-support/register";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MergeMethod } from "../src/client";

describe("graphql()", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("find pull request id", async () => {
    const graphql = await vi.hoisted(async () => {
      return vi.fn().mockReturnValue({
        data: {
          repository: {
            pullRequest: {
              id: "100",
              state: "OPEN",
            },
          },
        },
      });
    });
    vi.mock("@octokit/graphql", () => ({
      graphql,
    }));

    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    const pullRequest = await client.findPullRequestId({
      owner: "poad",
      repo: "test",
      number: 0,
    });
    expect(pullRequest?.id).not.toBeNull();
  });

  it("enableAutoMerge pull request (squash)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    await client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: MergeMethod.SQUASH,
    });
  });

  it("enableAutoMerge pull request (rebase)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    await client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: MergeMethod.REBASE,
    });
  });

  it("enableAutoMerge pull request (merge)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    await client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: MergeMethod.MERGE,
    });
  });

  it("valueOf MergeMethod", async () => {
    expect(MergeMethod.valueOf("MERGE")).toBe(MergeMethod.MERGE);
    expect(MergeMethod.valueOf("SQUASH")).toBe(MergeMethod.SQUASH);
    expect(MergeMethod.valueOf("REBASE")).toBe(MergeMethod.REBASE);
    expect(MergeMethod.valueOf("")).toBeUndefined();
  });
});

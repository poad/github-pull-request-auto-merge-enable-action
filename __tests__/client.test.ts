import "source-map-support/register";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("graphql()", () => {
  afterEach(() => {
    vi.doUnmock("@octokit/graphql");
    vi.resetAllMocks();
  });

  it("find pull request id", async () => {
    const graphql = vi.fn().mockReturnValue({
      data: {
        repository: {
          pullRequest: {
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          },
        },
      },
    });
    vi.doMock("@octokit/graphql", () => ({
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
    vi.unmock("@octokit/graphql");
  });

  it("find pull request failed", async () => {
    const graphql = vi.fn().mockReturnValue(undefined);
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
    expect(pullRequest?.id).toBeUndefined();
  });

  it("find pull request failed (no repository)", async () => {
    const graphql = vi.fn().mockReturnValue({ data: {} });
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
    expect(pullRequest?.id).toBeUndefined();
  });

  it("find pull request failed (no pull request)", async () => {
    const graphql = vi.fn().mockReturnValue({
      data: {
        repository: {},
      },
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
    expect(pullRequest?.id).toBeUndefined();
  });

  it("find pull request failed (empty pull request)", async () => {
    const graphql = vi.fn().mockReturnValue({
      data: {
        repository: {
          pullRequest: {},
        },
      },
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
    expect(pullRequest?.id).toBeUndefined();
  });

  it("approvePullRequestReview pull request", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    await client.approvePullRequestReview({
      pullRequestId: "test",
      reviewId: "test2",
    });
  });

  it("enableAutoMerge pull request", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    const result = client.enableAutoMerge({
      pullRequestId: "test",
    });
    expect(result).resolves;
  });

  it("enableAutoMerge pull request (squash)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    const result = client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: "SQUASH",
    });
    expect(result).resolves;
  });

  it("enableAutoMerge pull request (rebase)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    const result = client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: "REBASE",
    });
    expect(result).resolves;
  });

  it("enableAutoMerge pull request (merge)", async () => {
    const GitHubClient = (await import("../src/client")).default;
    const client = new GitHubClient("");
    const result = client.enableAutoMerge({
      pullRequestId: "test",
      mergeMethod: "MERGE",
    });
    expect(result).resolves;
  });
});

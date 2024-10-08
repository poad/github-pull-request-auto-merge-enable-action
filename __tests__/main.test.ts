import { rejects } from "node:assert";
import "source-map-support/register";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ApprovePullRequestReviewParam,
  EnableAutoMergeParam,
  FindPullRequestIdParam,
  IGitHubClient,
  IPullRequest,
} from "../src/client";

describe("run()", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("unsupported merge method", async () => {
    vi.mock("../src/client.ts", async () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockRejectedValue(new Error()),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    rejects(
      run({
        token: "",
        pullRequestNumber: 0,
        owner: "",
        repo: "",
        mergeMethod: "hoge",
        withApprove: false,
      }),
    );
  });

  it("no state", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            reviews: {
              nodes: [{ id: "test" }, { id: "test2" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi.fn(),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: true,
    });
  });

  it("merge", async () => {
    vi.mock("../src/client.ts", async () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      mergeMethod: "MERGE",
      withApprove: false,
    });
  });

  it("squash", async () => {
    vi.mock("../src/client.ts", async () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      mergeMethod: "SQUASH",
      withApprove: false,
    });
  });

  it("rebase", async () => {
    vi.mock("../src/client.ts", async () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      mergeMethod: "REBASE",
      withApprove: false,
    });
  });

  it("normal", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: false,
    });
  });

  it("with approve", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi.fn(),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: true,
    });
  });

  it("cannot resolve pull request", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue(undefined),
        enableAutoMerge: vi
          .fn()
          .mockRejectedValue(new Error()),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    expect(
      run({
        token: "",
        pullRequestNumber: 0,
        owner: "",
        repo: "",
        withApprove: false,
      }),
    ).resolves;
  });

  it("pull request was not open", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "CLOSED",
            reviews: {
              nodes: [],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: false,
    });
  });

  it("no revirews", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: false,
    });
  });

  it("no revirews with approve", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi
          .fn()
          .mockRejectedValue(new Error()),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: true,
    });
  });

  it("multipule reviews", async () => {
    vi.mock("../src/client.ts", () => {
      const _default = vi.fn(() => ({
        findPullRequestId: vi
          .fn()
          .mockResolvedValue({
            id: "100",
            state: "OPEN",
            reviews: {
              nodes: [{ id: "test" }, { id: "test2" }],
            },
          }),
        enableAutoMerge: vi.fn(),
        approvePullRequestReview: vi.fn(),
      }));
      return { default: _default };
    });

    const { run } = await import("../src/main");
    await run({
      token: "",
      pullRequestNumber: 0,
      owner: "",
      repo: "",
      withApprove: true,
    });
  });
});

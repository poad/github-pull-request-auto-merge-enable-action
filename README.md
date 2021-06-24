# github-pull-request-auto-merge-enable-action

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](LICENSE)
![CI](https://github.com/poad/github-pull-request-auto-merge-enable-action/workflows/CI/badge.svg)
[![GitHub release](https://img.shields.io/github/release/poad/github-pull-request-auto-merge-enable-action.svg)](https://GitHub.com/poad/github-pull-request-auto-merge-enable-action/releases/)

Enables auto merge to Pull Request by [octokit/graphql.js](https://github.com/octokit/graphql.js/).

## Useage

```$yaml
- name: Enables auto merge to Pull Request
  uses: poad/github-pull-request-auto-merge-enable-action@v1.0.0
  with:
      pull_request_id: { node_id of GitHub Pull Request }
      pull_request_number: { number of GitHub Pull Request }
      github_token: { GitHub token for Pull Request creation }
      owner: { name of repository owner }
      merge_method: { merge method }
```

### Reference Information

[GitHub API](https://docs.github.com/en/graphql/reference/mutations#enablepullrequestautomerge)

#### The following parameters are not supported

- authorEmail
- clientMutationId
- commitBody
- commitHeadline

## Outputs

not supported

# github-pull-request-auto-merge-enable-action

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](LICENSE)
![CI](https://github.com/poad/github-pull-request-auto-merge-enable-action/workflows/CI/badge.svg)
[![GitHub release](https://img.shields.io/github/release/poad/github-pull-request-auto-merge-enable-action.svg)](https://GitHub.com/poad/github-pull-request-auto-merge-enable-action/releases/)

Enables auto merge to Pull Request by [octokit/graphql.js](https://github.com/octokit/graphql.js/).

## Useage

```$yaml
- name: Enables auto merge to Pull Request
  uses: poad/github-pull-request-auto-merge-enable-action@v2.1.0
  with:
      pull_request_number: { number of GitHub Pull Request }
      github_token: { GitHub token for Pull Request creation }
      owner: { name of repository owner }
      merge_method: { merge method }
      with_approve: { true or false }
```

| **Input**                | **Require** | **Description**                                                                                                                               |
|--------------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `pull_request_number`    | Y           | number of GitHub Pull Request                                                                                                                 |
| `github_token`           | N           | GitHub token for Pull Request creation                                                                                                        |
| `owner`                  | Y           | name of repository owner                                                                                                                      |
| `merge_method`           | N           | merge method. see [GitHub API Docs](https://docs.github.com/en/graphql/reference/mutations#enablepullrequestautomerge)                        |
| `with_approve`           | Y           | true if the Pull Request is approved. see [GitHub API Docs](https://docs.github.com/en/graphql/reference/mutations#submitpullrequestreview)   |


### Reference Information

[Auto Merge](https://docs.github.com/en/graphql/reference/mutations#enablepullrequestautomerge)
[Approve](https://docs.github.com/en/graphql/reference/mutations#submitpullrequestreview)

#### The following parameters are not supported

- authorEmail
- clientMutationId
- commitBody
- commitHeadline

## Outputs

not supported

import * as core from '@actions/core'
import GitHubClient, {IPullRequest, MergeMethod} from './client'
import 'source-map-support/register'

const run = async (): Promise<void> => {
  const errHandler = (error: unknown) => {
    if (error instanceof Error) {
      core.error(error)
      core.setFailed(error)
      return
    }
    const e = error instanceof Error ? error : JSON.stringify(error)
    core.error(e)
    core.setFailed(e)
  }
  try {
    const token: string = core.getInput('github_token')
    const pullRequestNumber = Number(core.getInput('pull_request_number'))
    const pullRequestId = core.getInput('pull_request_id')
    const owner: string = core.getInput('owner')
    const repo: string = core.getInput('repository')
    const mergeMethod: string = core.getInput('merge_method')

    core.info(`owner: ${owner}`)
    core.info(`repository: ${repo}`)
    core.info(`pull_request_number: ${pullRequestNumber}`)
    core.info(`pull_request_id: ${pullRequestId}`)
    core.info(`merge_method: ${mergeMethod}`)

    if (pullRequestNumber === 0 && !pullRequestId) {
      errHandler(
        new Error('pull_request_number or pull_request_id must be specified')
      )
    }

    const client = new GitHubClient(token)
    const resp = !pullRequestId
        ? (await client.findPullRequestId({
            owner,
            repo: repo,
            number: pullRequestNumber
          }))
        : {id: pullRequestId}

    const { id, state } = resp || {} as IPullRequest
    if (state !== 'OPEN') {
      core.warning(`target pull request state: ${state}`)
      return
    }

    core.info(`target pull request id: ${id}`)

    if (id) {
      await client.enableAutoMerge(
        mergeMethod
          ? {
          pullRequestId: id,
            mergeMethod: MergeMethod.valueOf(mergeMethod)
          }
          : { pullRequestId: id }
      )
    }
  } catch (error) {
    errHandler(error)
  }
}

Promise.resolve(run()).catch((error: Error) => {
  core.error(error.stack ? error.stack?.toString() : error)
  core.setFailed(error)
})

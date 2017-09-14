const simple = require('simple-mock')
const {test} = require('tap')

const createIssue = require('../../lib/create-issue')

const api = {
  repos: {
    create: () => {}
  }
}

test('create issue request succeeds', t => {
  const state = {
    api,
    debug: () => {},
    owner: 'owner',
    repo: 'repo',
    title: 'title',
    body: 'body',
    labels: 'labels',
    template: '`test patch:$DIFF filename:$FILENAME bloburl:$BLOB_URL repo:$REPO`'
    }

  simple.mock(api.repos, 'createIssue').resolveWith({
    data: {
      issue: {
        html_url: 'html_url'
      },
      commit: {
        filename: 'filename',
        patch: 'patch',
        blobUrl: 'blobUrl'
      }
    }
  })

  createIssue(state)

  .then(() => {
    const content = state.template
    const createIssueArgs = api.repos.createIssue.lastCall.arg
    t.is(createIssueArgs.owner, 'owner')
    t.is(createIssueArgs.repo, 'repo')
    t.is(state.commit.message, 'title')
    t.is(content, 'body')
    t.is(state.labels, 'labels')

    simple.restore()
    t.end()
  })
})
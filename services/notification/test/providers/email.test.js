import test from 'ava'

import * as Slack from '../../src/providers/slack.js'

test('send should handle not found schema type', async (t) => {
  try {
    await Slack.send('hello', 'https://google.com', {})
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.is(error.message, `Type of hello is not available for Slack integration`)
  }
})

test('send should handle invalid properties', async (t) => {
  try {
    await Slack.send('review', 'https://google.com', {})
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes(`application icon is required and should be a valid link`))
  }
})

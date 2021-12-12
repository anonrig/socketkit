import test from 'ava'

import * as Discord from '../../src/providers/discord.js'

test('send should handle not found schema type', async (t) => {
  try {
    await Discord.send('hello', 'https://google.com', {})
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.is(error.message, `Type of hello is not available for Discord integration`)
  }
})

test('send should handle invalid properties', async (t) => {
  try {
    await Discord.send('review', 'https://google.com', {})
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.is(error.message, `application icon is required and should be a valid link`)
  }
})

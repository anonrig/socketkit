import Logger from '../logger.js'
import { INTEGRATION } from '../consumers/keys.js'

const logger = Logger.create().withScope('producer')

async function main() {
  await rabbitmq.init()

  const queue = rabbitmq.amqpKit.getQueue('appstore')

  const response = await queue?.sendEvent(
    INTEGRATION.ON_CREATE,
    {
      account_id: 'a100027a-102b-48f6-a3dd-37e1b2513df6',
      access_token: 'f5bd0abe-94b8-448d-8193-74a517266543',
      // date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    },
    { persistent: false },
  )

  // const response = await queue?.sendEvent('statistics', {
  //   integrationId: '5cd49f5c-2680-48e0-b695-9e7bc6290e47'
  // })

  logger.success(`Sent event response=${JSON.stringify(response)}`)
  process.exit(0)
}

main()

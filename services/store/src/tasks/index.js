import config from '../config.js'
import logger from '../logger.js'

import fetchApplications from './applications-fetcher.js'
import fetchReviews from './reviews-fetcher.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function generateTask(task, label, limit) {
  try {
    const processed = await task(limit)

    if (processed > 0) {
      logger.debug(`Processed ${processed} ${label}`)
    }
  } catch (error) {
    logger.error(error)
  }

  await sleep(5 * 60 * 1000)

  await generateTask(task, label)
}

export async function runTasks() {
  await Promise.all([
    generateTask(fetchApplications, 'applications', config.applications_batch_size),
    generateTask(fetchReviews, 'reviews', config.reviews_batch_size),
  ])
}

import AppStoreReporter from 'appstore-reporter'
import logger from '../../logger.js'

export default async function onValidate(accessToken) {
  try {
    const reporter = new AppStoreReporter.default({ accessToken })
    const response = await reporter.default.sales.getStatus()
    return response
  } catch (error) {
    logger.withScope('integrations').withTag('onValidate').warn(error)
    return false
  }
}

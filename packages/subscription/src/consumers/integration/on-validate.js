import AppStoreReporter from 'appstore-reporter'

export default async function onValidate(accessToken) {
  try {
    const reporter = new AppStoreReporter.default({ accessToken })
    const response = await reporter.sales.getStatus()
    return response
  } catch (error) {
    return false
  }
}

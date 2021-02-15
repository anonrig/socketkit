import AppStoreReporter from 'appstore-reporter'

export default async function onValidate(accessToken) {
  try {
    const reporter = new AppStoreReporter.default({ accessToken })
    await reporter.sales.getStatus()
    return true
  } catch (error) {
    return false
  }
}

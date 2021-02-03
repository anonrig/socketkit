import AppStoreReporter from 'appstore-reporter'

export default async function onValidate(accessToken) {
  try {
    const reporter = new AppStoreReporter.default({ accessToken })
    return reporter.sales.getStatus()
  } catch (error) {
    return false
  }
}

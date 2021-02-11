import * as Packages from './packages.js'

export const findPackagesGroupByApplication = async (
  {
    request: { account_id },
  },
  callback,
) => {
  try {
    callback(null, { rows: await Packages.findGroupByApplication({ account_id }) } )
  } catch (error) {
    callback(error)
  }
}

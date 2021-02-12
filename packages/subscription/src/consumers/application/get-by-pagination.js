import * as Application from '../../models/application.js'

export default async function getByPagination(
  { account_id },
  { limit, cursor, filter },
) {
  return {
    rows: await Application.findAll({ account_id }, { limit, cursor, filter }),
  }
}

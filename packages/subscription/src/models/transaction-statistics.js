import pg from '../pg.js'

export function sum({
  account_id,
  application_id,
  start_date,
  change_date,
  end_date,
}) {
  return pg
    .queryBuilder()
    .select(
      change_date
        ? [
            pg.raw(
              'sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date >= ?)` +
                ' AS current_total_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date >= ? AND transaction_type = 'refund')` +
                ' AS current_refund_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date < ?)` +
                ' AS changed_total_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date < ? AND transaction_type = 'refund')` +
                ' AS changed_refund_developer_proceeds',
              [change_date],
            ),
          ]
        : [
            pg.raw(
              'sum(base_developer_proceeds)' +
                ' AS current_total_developer_proceeds',
            ),
            pg.raw(
              'sum(base_developer_proceeds)' +
                ` FILTER (WHERE transaction_type = 'refund')` +
                ' AS current_refund_developer_proceeds',
            ),
          ],
    )
    .from('client_transactions')
    .where(function () {
      this.where({ account_id })

      if (application_id) {
        this.andWhere({ application_id })
      }
      if (start_date) {
        this.andWhere('event_date', '>=', [start_date])
      }
      if (end_date) {
        this.andWhere('event_date', '<=', [end_date])
      }
    })
    .first()
}

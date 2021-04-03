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
              'COALESCE(round(sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date >= ?), 2), 0)` +
                ' AS current_total_base_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'COALESCE(round(sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date >= ? AND transaction_type = 'refund'), 2), 0)` +
                ' AS current_refund_base_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'COALESCE(round(sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date < ?), 2), 0)` +
                ' AS changed_total_base_developer_proceeds',
              [change_date],
            ),
            pg.raw(
              'COALESCE(round(sum(base_developer_proceeds)' +
                ` FILTER (WHERE event_date < ? AND transaction_type = 'refund'), 2), 0)` +
                ' AS changed_refund_base_developer_proceeds',
              [change_date],
            ),
          ]
        : [
            pg.raw(
              'COALESCE(round(sum(base_developer_proceeds), 2), 0)' +
                ' AS current_total_base_developer_proceeds',
            ),
            pg.raw(
              'COALESCE(round(sum(base_developer_proceeds)' +
                ` FILTER (WHERE transaction_type = 'refund'), 2), 0)` +
                ' AS current_refund_base_developer_proceeds',
            ),
          ],
    )
    .from('transactions')
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

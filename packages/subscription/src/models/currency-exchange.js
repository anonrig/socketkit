import pg from '../pg.js'
import fixer from '../fixer.js'

export async function findByPk({ currency_id, exchange_date }) {
  const exchange = await pg
    .select('*')
    .from('currency_exchanges')
    .where({ exchange_date, currency_id })
    .first()

  if (exchange) {
    return exchange
  }

  const rates = await getRemoteRates(exchange_date, 'USD')

  const normalized = Object.keys(rates)
    .filter(
      // These are the crypto-currencies we won't need on production.
      (currency_id) => !['XAG', 'XAU', 'ZMK', 'BTC'].includes(currency_id),
    )
    .map((currency_id) => ({
      currency_id,
      exchange_date,
      // eslint-disable-next-line security/detect-object-injection
      amount: rates[currency_id],
    }))

  await pg('currency_exchanges')
    .insert(normalized)
    .onConflict(['currency_id', 'exchange_date'])
    .merge()

  return pg('currency_exchanges')
    .select('*')
    .where({ exchange_date, currency_id })
    .first()
}

export async function getRemoteRates(date, base = 'USD') {
  const { rates } = await fixer.forDate(date, { base })
  return rates
}

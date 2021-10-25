import fixer from 'fixer-api'

import config from './config.js'

fixer.set({ accessKey: config.fixerKey })

export async function getExchangeRates(date, base = 'USD') {
  const { rates } = await fixer.forDate(date.toString(), { base })

  return rates
}

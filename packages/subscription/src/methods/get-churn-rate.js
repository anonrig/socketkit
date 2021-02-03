import getActiveClientCount from './get-active-client-count.js'
import getLostClientCount from './get-lost-client-count.js'

export default async function getChurnRate(
  { account_id, application_id },
  { filter },
) {
  const lostCustomers = await getLostClientCount(
    { account_id, application_id },
    { filter },
  )
  const initialCustomers = await getActiveClientCount(
    { account_id, application_id },
    { to: filter.from },
  )

  return {
    initial: initialCustomers,
    lost: lostCustomers,
    rate: parseFloat(
      ((lostCustomers / initialCustomers) * 100).toFixed(2) ?? '0.00',
    ),
  }
}

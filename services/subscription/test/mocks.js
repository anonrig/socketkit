import dayjs from 'dayjs'

export const WITH_FREE_TRIAL = {
  country: 'US',
  customerPrice: '0.00',
  developerProceeds: '0.00',
  subscriptionOfferDuration: '3 Days',
  standardSubscriptionDuration: '1 Month',
}

export const REFUND = {
  country: 'US',
  refund: 'Yes',
  purchaseDate: dayjs().format('YYYY-MM-DD'),
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  standardSubscriptionDuration: '1 Month',
}
export const STANDARD = {
  country: 'US',
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  customerCurrency: 'USD',
  proceedsCurrency: 'USD',
  standardSubscriptionDuration: '1 Week',
  eventDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
}

export const exchange_rates = {
  USD: 1,
}

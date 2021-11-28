import dayjs from 'dayjs'

export const WITH_FREE_TRIAL = {
  country: 'US',
  customerPrice: '0.00',
  developerProceeds: '0.00',
  standardSubscriptionDuration: '1 Month',
  subscriptionOfferDuration: '3 Days',
}

export const REFUND = {
  country: 'US',
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  purchaseDate: dayjs().format('YYYY-MM-DD'),
  refund: 'Yes',
  standardSubscriptionDuration: '1 Month',
}
export const STANDARD = {
  country: 'US',
  customerCurrency: 'USD',
  customerPrice: '-9.99',
  developerProceeds: '9.99',
  eventDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
  proceedsCurrency: 'USD',
  standardSubscriptionDuration: '1 Week',
}

export const exchange_rates = {
  USD: 1,
}

import dayjs from 'dayjs'
import TableBadge from 'components/table/badge.js'

export default [
  {
    id: 'subscription_package_name',
    Header: 'Subscription',
    accessor: function GetTransactionPackage(field) {
      return <div className="text-warmGray-900">{field.subscription_package_name}</div>
    },
    className: 'truncate w-56',
  },
  {
    id: 'country_name',
    Header: 'Country',
    accessor: 'country_name',
  },
  {
    id: 'base_subscriber_purchase',
    Header: 'Sale',
    accessor: function GetTransactionSale(field) {
      return `$${parseFloat(field.base_subscriber_purchase).toFixed(2)}`
    },
    className: '!text-right w-24',
  },
  {
    id: 'base_developer_proceeds',
    Header: 'Proceed',
    accessor: function GetTransactionProceed(field) {
      return `$${parseFloat(field.base_developer_proceeds).toFixed(2)}`
    },
    className: '!text-right w-24',
  },
  {
    id: 'transaction_type',
    Header: 'Type',
    accessor: function GetTransactionType(field) {
      const state =
        field.transaction_type == 'renewal'
          ? 'success'
          : field.transaction_type == 'refund'
          ? 'danger'
          : 'info'
      return <TableBadge state={state}>{field.transaction_type}</TableBadge>
    },
    className: 'w-20',
  },
  {
    id: 'event_date',
    Header: 'Event Date',
    accessor: function GetTransactionEventDate(field) {
      return `${dayjs(field.event_date).format('YYYY-MM-DD')}`
    },
    className: '!text-right w-32',
  },
]

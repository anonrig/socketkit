import TableBadge from 'components/table/badge'
import dayjs from 'dayjs'

export default [
  {
    Header: 'Subscription',
    accessor: function GetTransactionPackage(field) {
      return <div className="text-stone-900">{field.subscription_package_name}</div>
    },
    className: 'truncate w-56',
    id: 'subscription_package_name',
  },
  {
    Header: 'Country',
    accessor: 'country_name',
    id: 'country_name',
  },
  {
    Header: 'Sale',
    accessor: function GetTransactionSale(field) {
      return `$${parseFloat(field.base_subscriber_purchase).toFixed(2)}`
    },
    className: '!text-right w-24',
    id: 'base_subscriber_purchase',
  },
  {
    Header: 'Proceed',
    accessor: function GetTransactionProceed(field) {
      return `$${parseFloat(field.base_developer_proceeds).toFixed(2)}`
    },
    className: '!text-right w-24',
    id: 'base_developer_proceeds',
  },
  {
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
    className: 'w-24 text-right',
    id: 'transaction_type',
  },
  {
    Header: 'Event Date',
    accessor: function GetTransactionEventDate(field) {
      return `${dayjs(field.event_date).format('YYYY-MM-DD')}`
    },
    className: '!text-right w-32',
    id: 'event_date',
  },
]

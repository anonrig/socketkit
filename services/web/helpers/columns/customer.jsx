import dayjs from 'dayjs'

export default [
  {
    Header: 'Subscriber Id',
    accessor: function GetCustomerId(field) {
      return <div className="text-stone-900">{field.subscriber_id}</div>
    },
    className: 'w-32',
    id: 'subscriber_id',
  },
  {
    Header: 'Device',
    accessor: 'device_type_name',
    className: 'w-24',
    id: 'device',
  },
  {
    Header: 'Country',
    accessor: 'country_name',
    id: 'country_name',
  },
  {
    Header: 'Sales',
    accessor: function GetCustomerSales(field) {
      return `$${parseFloat(field.total_base_subscriber_purchase).toFixed(2)}`
    },
    className: '!text-right w-24',
    id: 'sales',
  },
  {
    Header: 'Proceeds',
    accessor: function GetCustomerProceeds(field) {
      return `$${parseFloat(field.total_base_developer_proceeds).toFixed(2)}`
    },
    className: '!text-right w-24',
    id: 'proceeds',
  },
  {
    Header: 'Start Date',
    accessor: function GetCustomerFirstInteraction(field) {
      return dayjs(field.first_interaction).format('YYYY-MM-DD')
    },
    className: '!text-right w-36',
    id: 'first_interaction',
  },
]

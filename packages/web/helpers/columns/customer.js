import dayjs from 'dayjs'
import countries from 'helpers/countries.json'

export default [
  {
    id: 'subscriber_id',
    Header: 'Subscriber Id',
    accessor: function GetCustomerId(field) {
      return <div className="text-warmGray-900">{field.subscriber_id}</div>
    },
    className: 'w-32',
  },
  {
    id: 'device',
    Header: 'Device',
    accessor: 'device_type_name',
    className: 'w-24',
  },
  {
    id: 'country_name',
    Header: 'Country',
    accessor: function GetCustomerCountry(field) {
      return countries[field.country_id]?.name
    },
  },
  {
    id: 'sales',
    Header: 'Sales',
    accessor: function GetCustomerSales(field) {
      return `$${parseFloat(field.total_base_subscriber_purchase).toFixed(2)}`
    },
    className: '!text-right w-24',
  },
  {
    id: 'proceeds',
    Header: 'Proceeds',
    accessor: function GetCustomerProceeds(field) {
      return `$${parseFloat(field.total_base_developer_proceeds).toFixed(2)}`
    },
    className: '!text-right w-24',
  },
  {
    id: 'first_interaction',
    Header: 'Start Date',
    accessor: function GetCustomerFirstInteraction(field) {
      return dayjs(field.first_interaction).format('YYYY-MM-DD')
    },
    className: '!text-right w-36',
  },
]

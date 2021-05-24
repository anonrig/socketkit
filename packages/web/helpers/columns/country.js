import countries from 'helpers/countries.json'

export default [
  {
    id: 'country_name',
    Header: 'Country',
    accessor: function GetCountryName(field) {
      return countries[field.country_id]?.name
    },
  },
  {
    id: 'total_count',
    Header: 'Customers',
    accessor: 'total_count',
    className: 'w-24',
  },
  {
    id: 'total_direct_sale_count',
    Header: 'Direct Sale',
    accessor: 'total_direct_sale_count',
    className: 'w-36',
  },
  {
    id: 'total_trial_count',
    Header: 'Trials',
    accessor: 'total_trial_count',
    className: 'w-24',
  },
  {
    id: 'churn',
    Header: 'Churn',
    accessor: function GetCountryChurn(field) {
      return `${(
        ((field.churned_from_trial + field.churned_from_direct_sale) / field.total_count) *
        100
      ).toFixed(2)}%`
    },
    className: '!text-right w-24',
  },
  {
    id: 'lead_conversion',
    Header: 'Conversion',
    accessor: function GetCountryConversion(field) {
      return `${((field.paid_converted_from_trial / field.total_trial_count) * 100).toFixed(2)}%`
    },
    className: '!text-right w-32',
  },
  {
    id: 'revenue',
    Header: 'Revenue',
    accessor: function GetCountryRevenue(field) {
      return `$${field.revenue ?? 0}`
    },
    className: '!text-right w-24',
  },
]

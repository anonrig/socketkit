export default [
  {
    id: 'country_name',
    Header: 'Country',
    accessor: 'country_name',
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
    accessor: function GetCountryChurn({
      churned_from_trial,
      churned_from_direct_sale,
      total_count,
    }) {
      const rate =
        total_count === 0
          ? '0.00'
          : (((churned_from_trial + churned_from_direct_sale) / total_count) * 100).toFixed(2)
      return `${rate}%`
    },
    className: '!text-right w-24',
  },
  {
    id: 'lead_conversion',
    Header: 'Conversion',
    accessor: function GetCountryConversion({ paid_converted_from_trial, total_trial_count }) {
      const rate =
        total_trial_count === 0
          ? '0.00'
          : ((paid_converted_from_trial / total_trial_count) * 100).toFixed(2)
      return `${rate}%`
    },
    className: '!text-right w-32',
  },
  {
    id: 'revenue',
    Header: 'Revenue',
    accessor: function GetCountryRevenue({ revenue = 0 }) {
      return `$${revenue}`
    },
    className: '!text-right w-24',
  },
]

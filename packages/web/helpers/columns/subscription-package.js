export default [
  {
    id: 'subscription_package_id',
    Header: 'Identifier',
    accessor: function GetSubscriptionPackageId(field) {
      return <div className="font-semibold">{field.subscription_package_id}</div>
    },
    className: 'w-24',
  },
  { id: 'subscription_name', Header: 'Name', accessor: 'subscription_name' },
  {
    id: 'subscription_duration',
    Header: 'Duration',
    accessor: 'subscription_duration',
    className: '!text-right w-32',
  },
]

import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Table from 'components/table/table.js'
import { fetcher } from 'helpers/fetcher'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps({
  query: { id },
  req: {
    headers: { cookie, referer },
  },
}) {
  const initialData = await fetcher(`applications/${id}/packages?limit=10`, {
    headers: { cookie, referer },
  })
  return {
    props: { initialData },
  }
}

export default function SubscriptionPackages({ initialData }) {
  const { id } = useRouter().query
  const columns = useMemo(
    () => [
      {
        Header: 'Identifier',
        id: 'subscription_package_id',
        accessor: function SubscriptionPackageAccessor(field) {
          return <div className="font-semibold">{field.subscription_package_id}</div>
        },
        className: 'w-24',
      },
      { Header: 'Name', accessor: 'subscription_name' },
      { Header: 'Duration', accessor: 'subscription_duration', className: 'text-right w-32' },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/packages`}
      options={{}}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.subscription_package_id,
        onClick: () => {},
      })}
    />
  )
}

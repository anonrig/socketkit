import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Table from 'components/table/table.js'
import { fetcher } from 'helpers/fetcher'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const { id } = ctx.query
  const { cookie, referer } = ctx.req?.headers ?? {}
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
      { Header: 'Identifier', accessor: 'subscription_package_id' },
      { Header: 'Name', accessor: 'subscription_name' },
      { Header: 'Duration', accessor: 'subscription_duration' },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/packages`}
      options={{
        limit: 10,
      }}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.subscription_package_id,
        onClick: () => {},
      })}
    />
  )
}

import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Table from 'components/table/table.js'
import { fetcher } from 'helpers/fetcher'
import SidebarLayout from 'layouts/sidebar'
import Sidebar from 'components/sidebar-application'

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
    <SidebarLayout leading={<Sidebar id={id} />}>
      <div className="flex flex-1 justify-between mb-5 items-center">
        <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
          Subscription Packages
        </h3>
      </div>
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
    </SidebarLayout>
  )
}

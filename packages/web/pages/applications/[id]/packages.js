import { useMemo } from 'react'
import { useRouter } from 'next/router'
import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table.js'
import { fetchOnBackground } from 'helpers/server-side.js'

import SubscriptionPackageColumns from 'helpers/columns/subscription-package.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `applications/${query.id}/packages`)
}

export default function SubscriptionPackages({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => SubscriptionPackageColumns, [])

  return (
    <>
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.id}/packages`}
        options={{}}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.subscription_package_id,
          onClick: () => {},
        })}
      />
    </>
  )
}

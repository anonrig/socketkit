import { useRouter } from 'next/router'
import { useMemo } from 'react'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'

import TransactionColumns from 'helpers/columns/transaction.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `applications/${query.id}/transactions`)
}

export default function Transactions({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => TransactionColumns, [])
  setDateRangeIfNeeded(router, '/applications/[id]/transactions')

  return (
    <>
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.id}/transactions`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: `${original.subscriber_id}-${original.application_id}-${original.transaction_type}-${original.subscription_package_id}-${original.event_date}`,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
      />
    </>
  )
}

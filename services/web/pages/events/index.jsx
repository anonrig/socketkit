import ExpandedCell from 'components/expanded-cell'
import Heading from 'components/heading'
import Table from 'components/table/table'

import EventColumns from 'helpers/columns/event'
import { fetchOnBackground } from 'helpers/server-side'
import EventPropTypes, { EventCursor } from 'helpers/types/event'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, 'events')
}

function Events({ fallbackData }) {
  const router = useRouter()
  const columns = useMemo(() => EventColumns, [])

  return (
    <>
      <NextSeo title="Events" />
      <Heading className="mb-8">Events</Heading>

      <Table
        fallbackData={fallbackData}
        url="events"
        options={{ limit: 10 }}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'h-14 hover:bg-stone-50 cursor-pointer',
          key: `${original.application_id}-${original.client_id}-${original.session_started_at}-${original.created_at}`,
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No events found',
        }}
        renderRowSubComponent={({ row }) => <ExpandedCell row={row.original} />}
      />
    </>
  )
}

Events.propTypes = {
  fallbackData: PropTypes.shape({
    cursor: EventCursor,
    rows: PropTypes.arrayOf(EventPropTypes).isRequired,
  }),
}

export default Events

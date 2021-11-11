import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import Table from 'components/table/table'
import Heading from 'components/heading'
import ExpandedCell from 'components/expanded-cell'

import { fetchOnBackground } from 'helpers/server-side.js'
import EventColumns from 'helpers/columns/event.js'
import EventPropTypes, { EventCursor } from 'helpers/types/event.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ query, headers }, 'events')
}

function Events({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => EventColumns, [])

  return (
    <>
      <NextSeo title="Events" />
      <Heading className="mb-8">Events</Heading>

      <Table
        initialData={initialData}
        url="events"
        options={{ limit: 10 }}
        columns={columns}
        getRowProps={({ original }) => ({
          key: `${original.application_id}-${original.client_id}-${original.session_started_at}-${original.created_at}`,
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
        notFound={{
          title: 'No events found',
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          action: {
            message: 'Update integration',
            callback: () => router.push('/products/tracking'),
          },
        }}
        renderRowSubComponent={({ row }) => <ExpandedCell row={row.original} />}
      />
    </>
  )
}

Events.propTypes = {
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(EventPropTypes).isRequired,
    cursor: EventCursor,
  }),
}

export default Events

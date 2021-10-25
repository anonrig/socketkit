/* eslint-disable react/prop-types */
import Link from 'next/link'
import dayjs from 'dayjs'
import { SwitchVerticalIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import { EventTitles } from 'helpers/types/event.js'

export default [
  {
    id: 'expander',
    Header: function ExpanderHeader() {
      return (
        <button
          onClick={() => console.log('hello')}
          className="hover:bg-warmGray-100 rounded-md px-2 py-2 -mx-2 -my-2">
          <SwitchVerticalIcon className="h-4 w-4" />
        </button>
      )
    },
    Cell: function ExpanderCell({ row }) {
      return (
        <button
          {...row.getToggleRowExpandedProps({})}
          className="hover:bg-warmGray-100 rounded-md px-2 py-2 -mx-2 -my-2">
          {row.isExpanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
      )
    },
    className: 'w-12',
  },
  {
    id: 'title',
    Header: 'Event Title',
    accessor: function EventTitle({ title }) {
      return EventTitles[title] ?? title
    },
  },
  {
    id: 'application_id',
    Header: 'Application',
    accessor: 'application_id',
  },
  {
    id: 'session_started_at',
    Header: 'Session Time',
    accessor: function SessionStartedAt({ session_started_at }) {
      return dayjs(session_started_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
  },
  {
    id: 'created_at',
    Header: 'Time',
    accessor: function CreatedAt({ created_at }) {
      return dayjs(created_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
  },
  {
    id: 'client_id',
    Header: 'Client Id',
    accessor: function ClientId({ client_id }) { // eslint-disable-line
      return (
        <Link href={`/clients/${client_id}`}>
          <a className="line-clamp-1 text-orange-500 hover:underline">{client_id}</a>
        </Link>
      )
    },
    className: 'w-48 text-left',
  },
]

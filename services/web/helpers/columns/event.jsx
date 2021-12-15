/* eslint-disable react/prop-types */
import { SwitchVerticalIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import { EventTitles } from 'helpers/types/event.js'
import Link from 'next/link'

export default [
  {
    Cell: function ExpanderCell({ row }) {
      return (
        <button
          {...row.getToggleRowExpandedProps({})}
          className="hover:bg-stone-100 rounded-md px-2 py-2 -mx-2 -my-2"
        >
          {row.isExpanded ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </button>
      )
    },
    Header: function ExpanderHeader() {
      return (
        <button
          onClick={() => console.log('hello')}
          className="hover:bg-stone-100 rounded-md px-2 py-2 -mx-2 -my-2"
        >
          <SwitchVerticalIcon className="h-4 w-4" />
        </button>
      )
    },
    className: 'w-12',
    id: 'expander',
  },
  {
    Header: 'Event Title',
    accessor: function EventTitle({ title }) {
      return EventTitles[title.toString()] ?? title
    },
    id: 'title',
  },
  {
    Header: 'Application',
    accessor: 'application_id',
    id: 'application_id',
  },
  {
    Header: 'Session Time',
    accessor: function SessionStartedAt({ session_started_at }) {
      return dayjs(session_started_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
    id: 'session_started_at',
  },
  {
    Header: 'Time',
    accessor: function CreatedAt({ created_at }) {
      return dayjs(created_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
    id: 'created_at',
  },
  {
    Header: 'Client Id',
    id: 'client_id',
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

import dayjs from 'dayjs'

export default [
  {
    id: 'client_id',
    Header: 'Client Id',
    accessor: function ClientId({ client_id }) {
      return <p className="line-clamp-1">{client_id}</p>
    },
    className: 'w-72',
  },
  {
    id: 'title',
    Header: 'Title',
    accessor: 'title',
  },
  {
    id: 'session_started_at',
    Header: 'Initial Session',
    accessor: function SessionStartedAt({ session_started_at }) {
      return dayjs(session_started_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
  },
  {
    id: 'created_at',
    Header: 'Created At',
    accessor: function CreatedAt({ created_at }) {
      return dayjs(created_at).format('MMM DD, h:mm a')
    },
    className: 'w-40 text-right',
  },
]

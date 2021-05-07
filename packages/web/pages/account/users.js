import PropTypes from 'prop-types'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher.js'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const users = await fetcher(`accounts/users`, {
    headers: { cookie, referer },
  })
  return {
    props: { users },
  }
}

function Users({ users }) {
  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        Header: 'Email',
        accessor: 'email',
        className: 'w-24',
      },
      {
        id: 'role',
        Header: 'Role',
        accessor: 'role',
        className: 'w-24',
      },
      {
        id: 'member_since',
        Header: 'Member Since',
        accessor: (field) => `${dayjs(field.member_since).format('DD/MM/YYYY')}`,
        className: 'text-right w-40',
      },
    ],
    [],
  )

  return (
    <Table
      initialData={users}
      url="accounts/users"
      options={{}}
      columns={columns}
      getRowProps={({ original }) => ({
        id: original.subscriber_id,
        className: 'h-14 hover:bg-warmGray-50',
      })}
    />
  )
}

Users.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      member_since: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default Users

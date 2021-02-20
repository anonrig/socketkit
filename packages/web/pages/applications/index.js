import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { averageRating } from 'helpers/index.js'
import Table from 'components/table/table.js'
import { fetcher } from 'helpers/fetcher.js'

export default function Applications({ initialData }) {
  const router = useRouter()
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: function NameAccessor(field) {
          return (
            <div className="flex items-center">
              <img src={field.icon} className="h-8 w-8 mr-2" alt={field.title} />
              {field.title ?? field.application_id}
            </div>
          )
        },
      },
      {
        Header: 'Ratings',
        accessor: function RatingsAccessor(field) {
          const rating = averageRating(field.ratings)
          return (
            rating && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4 mr-1 text-orange-600">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                {rating}
              </div>
            )
          )
        },
      },
      {
        Header: 'Current Version',
        accessor: function CurrentVersionAccessor(field) {
          return field.version ?? 'Removed from Sale'
        },
      },
      {
        Header: 'Released On',
        accessor: function ReleasedAtAccessor(field) {
          return dayjs(field.released_at).format('YYYY/MM/DD')
        },
      },
      {
        Header: 'Updated At',
        accessor: function UpdatedAtAccessor(field) {
          return dayjs(field.updated_at).format('YYYY/MM/DD')
        },
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex flex-1 justify-between mb-5 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">Applications</h3>
        </div>
      </div>
      <Table
        initialData={initialData}
        url="applications"
        options={{
          limit: 10,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.application_id,
          onClick: () => router.push(`/applications/${original.application_id}`),
        })}
      />
    </>
  )
}

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(`applications?limit=10`, {
    headers: { cookie, referer },
  })
  return {
    props: { initialData },
  }
}

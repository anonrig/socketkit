import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SocketkitConfig from 'socketkit.config.js'

function Sidebar() {
  const router = useRouter()
  const { slug } = router.query

  const getReportsForGroup = ({ reports }) =>
    reports.map((report) => (
      <Link href={`/reports/${report.slug}`} key={report.slug}>
        <a
          className={cx([
            'hover:bg-gray-100 hover:text-stone-500 text-stone-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md',
            slug === report.slug ? 'bg-gray-100' : 'bg-white',
          ])}
          aria-current="page"
        >
          <span className="truncate">{report.short_title}</span>
        </a>
      </Link>
    ))

  return (
    <>
      <nav className="visible lg:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a report
        </label>
        <select
          name="tabs"
          onBlur={({ target: { value } }) => {
            const { slug } = SocketkitConfig.reports.find((i) => i.slug === value)
            router.push(`/reports/${slug}`)
          }}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
        >
          {SocketkitConfig.reports.map((report) => (
            <option key={report.slug} value={report.slug}>
              {report.short_title}
            </option>
          ))}
        </select>
      </nav>
      <nav className="hidden lg:block space-y-6">
        {SocketkitConfig.report_groups.map((group) => (
          <div key={group.name} className="space-y-1">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider pb-1">
              {group.name}
            </p>
            {getReportsForGroup(group)}
          </div>
        ))}
      </nav>
    </>
  )
}

export default Sidebar

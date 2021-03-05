import Link from 'next/link'
import SocketkitConfig from 'socketkit.config.js'
import cx from 'classnames'
import { useRouter } from 'next/router'

function Sidebar() {
  const router = useRouter()
  const { slug } = router.query

  const getReportsForGroup = ({ reports }) =>
    reports.map((report) => (
      <Link href={`/reports/${report.slug}`} key={report.slug}>
        <a
          className={cx([
            'hover:bg-gray-100 hover:text-warmGray-500 text-warmGray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md',
            slug === report.slug ? 'bg-gray-100' : 'bg-white',
          ])}
          aria-current="page">
          <span className="truncate">{report.short_title}</span>
        </a>
      </Link>
    ))

  return (
    <nav className="space-y-6">
      {SocketkitConfig.report_groups.map((group) => (
        <div key={group.name} className="space-y-1">
          <p className="text-xs font-semibold text-trueGray-500 uppercase tracking-wider pb-1">
            {group.name}
          </p>
          {getReportsForGroup(group)}
        </div>
      ))}
    </nav>
  )
}

export default Sidebar

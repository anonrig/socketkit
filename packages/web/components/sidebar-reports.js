import Link from 'next/link'
import SocketkitConfig from 'socketkit.config.js'
import cx from 'classnames'

function Sidebar() {
  const getReportsForGroup = ({ reports }) =>
    reports.map((report) => (
      <Link href={`/reports/${report.slug}`} key={report.slug}>
        <a
          className={cx([
            'hover:bg-gray-100 hover:text-gray-900 text-gray-800 group flex items-center px-3 py-2 text-sm font-medium rounded-md',
          ])}
          aria-current="page">
          <span className="truncate">{report.short_title}</span>
        </a>
      </Link>
    ))

  return (
    <nav className="space-y-4">
      {SocketkitConfig.report_groups.map((group) => (
        <div key={group.name} className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {group.name}
          </p>
          {getReportsForGroup(group)}
        </div>
      ))}
    </nav>
  )
}

export default Sidebar

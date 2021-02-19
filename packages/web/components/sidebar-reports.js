import ActiveLink from './active-link.js'

function Sidebar() {
  const activeClassName = 'bg-gray-50 text-orange-600 hover:text-orange-600'

  return (
    <nav className="space-y-1">
      <ActiveLink
        activeClassName={activeClassName}
        className="group rounded-md px-3 py-2 flex items-center text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-white"
        href={`/reports/hello-world`}
        exact={true}
      >
        <svg
          className="h-6 w-6 mr-3 -ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <span className="truncate">General</span>
      </ActiveLink>
    </nav>
  )
}

export default Sidebar

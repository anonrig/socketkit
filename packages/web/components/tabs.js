import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import cx from 'classnames'

function Tabs({ selected, items }) {
  const router = useRouter()

  return (
    <>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a page
        </label>
        <select
          name="tabs"
          onBlur={({ target: { value } }) => router.push(items.find((i) => i.key === value).href)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md">
          {items.map((item) => (
            <option key={item.key} value={item.key}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {items.map((item) => (
              <Link href={item.href} key={item.key}>
                <a
                  className={cx([
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    selected?.includes(item.key)
                      ? 'border-orange-500 text-orange-500 hover:border-orange-400 hover:text-orange-400'
                      : 'border-transparent text-warmGray-900 hover:text-warmGray-700 hover:border-warmGray-700',
                  ])}>
                  {item.title}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default Tabs

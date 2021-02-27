import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

function Subheader({ selected_href, items }) {
  return (
    <nav className="py-2 flex space-x-8 bg-white items-center justify-center" aria-label="Global">
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <a
            className={cx([
              selected_href.includes(item.href)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
              'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium',
            ])}>
            {item.title}
          </a>
        </Link>
      ))}
    </nav>
  )
}

Subheader.propTypes = {
  selected_href: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
}

export default Subheader

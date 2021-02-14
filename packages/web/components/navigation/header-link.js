import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

function HeaderLink({ children, to, active, className }) {
  const classnames = active
    ? 'text-orange-600 bg-gray-50 hover:bg-white'
    : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900'

  return (
    <Link href={to}>
      <a className={cx(
        'rounded-md py-2 px-3 items-center text-sm font-medium',
        className,
        classnames,
      )}>
        {children}
      </a>
    </Link>
  )
}

HeaderLink.defaultProps = {
  className: '',
  active: false,
}

HeaderLink.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  to: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  className: PropTypes.string,
}

export default HeaderLink

import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import PropTypes from 'prop-types'

function ActiveLink({ children, className, activeClassName, exact = false, href }) {
  const { asPath } = useRouter()
  const isActive = exact ? asPath === href : asPath.includes(href)
  return (
    <Link href={href}>
      <a className={cx(className, isActive ? activeClassName : null)}>{children}</a>
    </Link>
  )
}

ActiveLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string.isRequired,
  activeClassName: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  href: PropTypes.string.isRequired,
}

export default ActiveLink

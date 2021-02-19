import { useRouter } from 'next/router'
import Link from 'next/link'
import cx from 'classnames'

export default function ActiveLink({ children, className, activeClassName, exact = false, href }) {
  const { asPath } = useRouter()
  const isActive = exact ? asPath === href : asPath.includes(href)
  return (
    <Link href={href}>
      <a className={cx(className, isActive ? activeClassName : null)}>
        {children}
      </a>
    </Link>
  )
}

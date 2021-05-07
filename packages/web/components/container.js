import PropTypes from 'prop-types'
import cx from 'classnames'
function Container({ children, verticalPadding }) {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className={cx(['px-2 sm:px-6 lg:px-0', verticalPadding ? 'py-10' : ''])}>
        {children}
      </aside>
    </main>
  )
}

Container.defaultProps = {
  verticalPadding: true,
}

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  verticalPadding: PropTypes.bool,
}

export default Container

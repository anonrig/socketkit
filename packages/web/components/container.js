import PropTypes from 'prop-types'
import cx from 'classnames'
function Container({ children, vertical_padding }) {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className={cx(['px-2 sm:px-6 lg:px-0', vertical_padding ? 'py-10' : ''])}>
        {children}
      </aside>
    </main>
  )
}

Container.defaultProps = {
  vertical_padding: true,
}

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  vertical_padding: PropTypes.bool,
}

export default Container

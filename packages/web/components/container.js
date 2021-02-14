import PropTypes from 'prop-types'

function Container({ children }) {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className="py-6 px-2 sm:px-6 lg:py-6 lg:px-0">{children}</aside>
    </main>
  )
}

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}

export default Container

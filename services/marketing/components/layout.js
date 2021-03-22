import Footer from 'components/footer.js'
import Header from 'components/header.js'
import PropTypes from 'prop-types'

function Layout({ children }) {
  return (
    <div className="bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired,
  ]).isRequired,
}

export default Layout

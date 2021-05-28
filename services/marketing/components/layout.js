import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import PropTypes from 'prop-types'
import { useIntercom } from 'react-use-intercom'

function Layout({ children }) {
  const router = useRouter()
  const intercom = useIntercom()

  useEffect(() => {
    intercom.update({ last_request_at: parseInt(new Date().getTime() / 1000) })
  }, [router.pathname, intercom])

  useEffect(() => {
    intercom.boot()
  }, [intercom])

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

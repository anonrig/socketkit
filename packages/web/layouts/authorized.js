import Banner from 'components/banner.js'
import Container from 'components/container.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import ApplicationHeader from './application-header.js'
import SettingsHeader from './settings-header.js'

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { data } = useSWR('integrations')
  let header = null

  // Application header
  if (router.pathname.startsWith('/applications')) {
    // Don't render header on integration required page.
    if (!router.pathname.includes('integration-required')) {
      header = <ApplicationHeader />
    }
  }
  // Account header
  else if (router.pathname.startsWith('/account')) {
    header = <SettingsHeader />
  }

  return (
    <>
      <Header />
      {header}
      <Container>{children}</Container>
      <Footer />

      {data && data[0].rows.filter((d) => !!d.integration).length === 0 && (
        <Banner
          destination="/account/integrations"
          longMessage="Please, add an integration for Socketkit to work."
          shortMessage="Please, add an integration."
        />
      )}
    </>
  )
}

AuthorizedLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default AuthorizedLayout

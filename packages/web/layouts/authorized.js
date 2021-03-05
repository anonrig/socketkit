import PropTypes from 'prop-types'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Banner from 'components/banner.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import Container from 'components/container.js'

const ApplicationHeader = dynamic(
  () => import('./application-header.js' /* webpackChunkName: "ApplicationHeader" */),
  { ssr: false },
)
const SettingsHeader = dynamic(
  () => import('./settings-header.js' /* webpackChunkName: "SettingsHeader" */),
  { ssr: false },
)

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { data } = useSWR('integrations')
  let header = null

  if (router.pathname.startsWith('/applications')) {
    header = <ApplicationHeader />
  } else if (router.pathname.startsWith('/account')) {
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

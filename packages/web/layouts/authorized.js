import PropTypes from 'prop-types'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Banner from 'components/banner.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import Container from 'components/container.js'
import Subheader from '../components/sub-header.js'

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { data } = useSWR('integrations')
  const HeaderComponent = router.pathname.includes('/account') ? (
    <Subheader
      items={[
        { title: 'Account Settings', href: '/account/settings' },
        { title: 'Billing', href: '/account/billing' },
        { title: 'Integrations', href: '/account/integrations' },
      ]}
      selected_href={router.pathname}
    />
  ) : null

  return (
    <>
      <Header />
      {HeaderComponent}
      <Container>{children}</Container>
      <Footer />

      {data && data[0].rows.filter((d) => !!d.integration).length === 0 && (
        <Banner
          destination="/settings/integrations"
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

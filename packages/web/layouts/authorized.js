import PropTypes from 'prop-types'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Banner from 'components/banner.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import Container from 'components/container.js'
import Subheader from '../components/sub-header.js'
import { route } from 'next/dist/next-server/server/router'

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { data } = useSWR('integrations')
  let header = null

  if (router.pathname.includes('/account')) {
    header = (
      <Subheader
        items={[
          { title: 'Account Settings', href: '/account/settings' },
          { title: 'Billing', href: '/account/billing' },
          { title: 'Integrations', href: '/account/integrations' },
        ]}
        selected_href={router.pathname}
      />
    )
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

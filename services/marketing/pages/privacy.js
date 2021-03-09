import { NextSeo } from 'next-seo'
import Layout from 'components/layout.js'

export default function Privacy() {
  return (
    <Layout>
      <NextSeo
        title="Privacy Policy"
        description="We care about your privacy and your customers'. We are transparent about it. Here's the privacy policy to use Socketkit."
      />
    </Layout>
  )
}

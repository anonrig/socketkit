import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntercom } from 'react-use-intercom'
import Header from 'components/header.js'
import Footer from 'components/footer.js'

export default function Layout({ children }) {
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

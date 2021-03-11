import Header from '../components/header.js'
import Footer from '../components/footer.js'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  useEffect(() => {
    window?.Intercom('boot', {
      app_id: 'oz6arehx',
    })
  }, [])

  useEffect(() => {
    window?.Intercom('update')
  }, [router.pathname])

  return (
    <div className="bg-white">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/oz6arehx';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`,
          }}
        />
      </Head>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

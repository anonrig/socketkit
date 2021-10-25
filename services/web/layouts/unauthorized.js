import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useIntercom } from 'react-use-intercom'

function UnauthorizedLayout({ children }) {
  const router = useRouter()
  const intercom = useIntercom()

  useEffect(() => {
    intercom.update({ last_request_at: parseInt(new Date().getTime() / 1000) })
  }, [router.pathname, intercom])

  useEffect(() => {
    intercom.boot()
  }, [intercom])

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 space-y-4">
          <Image alt="Socketkit, Inc" src="/socketkit-icon.svg" width={50} height={50} />
          {children}
        </div>
      </div>
    </div>
  )
}

UnauthorizedLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default UnauthorizedLayout

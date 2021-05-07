import Image from 'next/image'

export default function UnauthorizedLayout({ children }) {
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

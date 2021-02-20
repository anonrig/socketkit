import landingImage from 'images/landing.webp'

export default function UnauthorizedLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">{children}</div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          alt="Socketkit, Inc."
          className="absolute inset-0 h-full w-full object-cover"
          src={landingImage}
        />
      </div>
    </div>
  )
}

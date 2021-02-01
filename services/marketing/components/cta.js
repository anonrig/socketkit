import Link from "next/link";

export default function CTA() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Get in touch or create an account.
          </span>
        </h2>
        <div className="mt-6 space-y-4 sm:space-y-0 sm:flex sm:space-x-5">
          <Link href="/solutions/analytics">
            <a className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-700 hover:to-orange-700">
              Learn more
            </a>
          </Link>
          <a
            href="https://web.socketkit.com"
            className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-orange-50 hover:bg-orange-100"
          >
            Get started
          </a>
        </div>
      </div>
    </div>
  );
}

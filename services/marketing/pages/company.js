import Layout from "../components/layout.js";
import Link from 'next/link';
import { NextSeo } from 'next-seo'

export default function Company() {
  return (
    <Layout>
      <NextSeo 
        title="Company"
        description="Event Management & Subscription Tracking platform for mobile applications without compromising privacy or security."
      />
      <div className="mx-auto py-12 px-4 max-w-7xl  lg:py-24">
        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
          <div className="pt-12 sm:pt-16 lg:pt-8">
            <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
              We're Socketkit, a company with a mission to improve privacy & security on mobile analytics.
            </h2>
            <div className="mt-6 text-gray-500 space-y-6">
              <p className="text-lg">
                Event Management & Subscription Tracking platform for mobile applications without compromising privacy or security.
              </p>
              <p className="text-base leading-7">
                We're a small team from New York & Istanbul who cares about privacy and security and wanted to distrupt the event management and tracking industry which enables faulty solutions to a simple problem: protecting users privacy. 
              </p>
              <p className="text-base leading-7">
                Analytics tracking companies  doesn't care about consumer privacy and force developers to use <b>binary</b> libraries, frameworks, which makes it impossible to keep track of which software is installed on your bundled mobile applications. 
              </p>
              <p className="text-base leading-7">
              We care about privacy and security. We limit the data collected from mobile applications and release it open-sourcely on <a href="https://github.com/socketkit" className="text-orange-600 hover:underline font-bold">GitHub</a>. To learn more about our security and privacy rules, visit our <Link href="/security" ><a className="text-orange-600 hover:underline font-bold">Security page</a></Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

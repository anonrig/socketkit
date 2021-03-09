import Link from 'next/link'
import dayjs from 'dayjs'
import { NextSeo } from 'next-seo'
import Layout from 'components/layout.js'
import { fetchEntries } from 'helpers/contentful.js'

export async function getServerSideProps() {
  const entries = await fetchEntries('guide')
  return { props: { entries } }
}

export default function Guides({ entries = [] }) {
  return (
    <Layout>
      <NextSeo
        title={'Guides & Tips'}
        description={`We care about sharing the things we learned along the way. Here's the tips and tricks on using Socketkit with your mobile application.`}
      />
      <div className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
              Guides & Tips
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              We care about sharing the things we learned along the way.
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {entries.map((entry) => (
              <div
                className="flex flex-col rounded-lg shadow-lg overflow-hidden"
                key={entry.sys.id}>
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={entry.fields.asset.fields.file.url}
                    alt={entry.fields.asset.fields.title}
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-500">
                      {entry.fields.category.fields.title}
                    </p>
                    <Link href={`/blog/${entry.fields.category.fields.slug}/${entry.fields.slug}`}>
                      <a className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{entry.fields.title}</p>
                        <p className="mt-3 text-base text-gray-500">
                          {entry.fields.short_description}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{entry.fields.author.fields.name}</span>
                      <img
                        className="h-10 w-10 rounded-full"
                        src={entry.fields.author.fields.profile_picture.fields.file.url}
                        alt={entry.fields.author.fields.profile_picture.fields.description}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.fields.author.fields.name}
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={dayjs(entry.sys.createdAt).format('YYYY-MM-DD')}>
                          {dayjs(entry.sys.createdAt).format('MMMM DD, YYYY')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

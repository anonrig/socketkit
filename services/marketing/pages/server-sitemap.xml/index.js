import { getServerSideSitemap } from 'next-sitemap'
import { fetchEntries } from 'helpers/contentful.js'

export async function getServerSideProps(ctx) {
  const posts = await fetchEntries()
  const urls = posts.map((post) => ({
    loc: `https://socketkit.com/blog/guides/${post.fields.slug}`,
    lastmod: post.sys.updatedAt,
    changefreq: 'weekly',
  }))

  return getServerSideSitemap(ctx, urls)
}

export default () => {}

import store from 'app-store-scraper'

const memorized = store.memoized({ maxAge: 60000 })
export default async function search({ query: { keyword, country_id } }) {
  const applications = await memorized.search({
    term: keyword,
    num: 10,
    page: 1,
    country: country_id ?? 'us',
    lang: 'en-US',
  })

  return applications.map((application) => ({
    id: application.id,
    bundle: application.appId,
    title: application.title,
    url: application.url,
    developer_id: application.developerId,
    developer_name: application.developer,
  }))
}

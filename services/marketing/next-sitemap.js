module.exports = {
  siteUrl: 'https://socketkit.com',
  changefreq: 'weekly',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://socketkit.com/server-sitemap.xml'],
  },
}

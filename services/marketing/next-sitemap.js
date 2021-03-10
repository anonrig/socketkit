module.exports = {
  siteUrl: 'https://www.socketkit.com',
  changefreq: 'weekly',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: ['https://www.socketkit.com/server-sitemap.xml'],
  },
}

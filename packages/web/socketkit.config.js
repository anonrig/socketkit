const report_groups = [
  {
    name: 'Recurring Revenue',
    reports: [
      {
        slug: 'mrr',
        title: 'Monthly Recurring Revenue',
        short_title: 'MRR',
        description:
          'MRR is a calculation of your normalised (amortized), monthly subscription revenue.',
        route: 'reports/mrr',
        labelFormat: (l) => `$${l}`,
      },
      {
        slug: 'mrr-movement',
        title: 'MRR Movement',
        short_title: 'MRR Movement',
        description:
          'MRR is a calculation of your normalised (amortized), monthly subscription revenue.',
        route: 'reports/mrr-movement',
        labelFormat: (l) => `$${l}`,
      },
    ],
  },
  {
    name: 'Leads & Trials',
    reports: [
      {
        slug: 'trials',
        title: 'Free Trials',
        short_title: 'Trials',
        description: 'The number of new free trials started over time',
        route: 'reports/trials',
        labelFormat: (l) => `${l} leads`,
      },
      {
        slug: 'trial-to-paid',
        title: 'Trial-to-paid conversion rate',
        short_title: 'Trial-to-paid conversion rate',
        description:
          'The percentage of free trials that have converted to active paying customers over time. ',
        route: 'reports/trial-to-paid',
        labelFormat: (l) => `%${l}`,
      },
      {
        slug: 'average-sales-cycle',
        title: 'Average Sales Cycle Length',
        short_title: 'Average Cycle',
        description:
          'The average number of days taken for a lead to convert into an active paying customer.',
        route: 'reports/average-duration',
        labelFormat: (l) => `${l} days`,
      },
    ],
  },
  {
    name: 'Subscribers',
    reports: [
      {
        slug: 'subscribers',
        title: 'Subscribers',
        short_title: 'Subscribers',
        description: 'The number of active paying subscribers.',
        route: 'reports/subscribers',
        labelFormat: (l) => `${l} subscribers`,
      },
      {
        slug: 'average-revenue-per-account',
        title: 'Average Revenue Per Account',
        short_title: 'Average Revenue Per Account',
        description: 'The average MRR across your active customers. (aka ARPU & ARPC)',
        route: 'reports/average-revenue-per-account',
        labelFormat: (l) => `$${l}`,
      },
      {
        slug: 'average-sale',
        title: 'Average Sale Price',
        short_title: 'Average Sale Price',
        description:
          'The average MRR of new customers at the moment they convert to a paid account.',
        route: 'reports/average-sale',
        labelFormat: (l) => `$${l}`,
      },
      {
        slug: 'customer-lifetime-value',
        title: 'Customer Lifetime Value',
        short_title: 'Customer Lifetime Value',
        description: 'An estimate of the total subscription value of an average customer.',
        route: 'reports/customer-lifetime-value',
        labelFormat: (l) => `$${l}`,
      },
      {
        slug: 'subscriptions',
        title: 'Subscriptions',
        short_title: 'Subscriptions',
        description: 'The number of active, paid subscriptions.',
        route: 'reports/subscriptions',
        labelFormat: (l) => `$${l}`,
      },
    ],
  },
]

export default {
  report_groups,
  reports: report_groups.map((g) => g.reports).flat(),
}

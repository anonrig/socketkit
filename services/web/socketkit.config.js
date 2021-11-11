const report_groups = [
  {
    name: 'Revenue',
    reports: [
      {
        slug: 'revenue',
        title: 'Revenue',
        short_title: 'Revenue',
        description: 'Daily revenues include your normalized total sales including your refunds.',
        formats: {
          y0: '$%',
        },
        defaults: {
          interval: 'day',
          range: 2,
          graph: 'bar',
          y_format: '>-.2f',
        },
      },
      {
        slug: 'recurring-revenue',
        title: 'Recurring Revenue',
        short_title: 'Recurring Revenue',
        description: 'Recurring revenue is a calculation of your normalised (amortized) revenue.',
        formats: {
          y0: '$%',
        },
        defaults: {
          interval: 'month',
          range: 3,
          graph: 'bar',
          y_format: '>-.2f',
        },
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
        formats: {
          y0: '% leads',
        },
        defaults: {
          interval: 'day',
          range: 1,
          graph: 'line',
        },
      },
      {
        slug: 'trial-to-paid',
        title: 'Trial-to-paid conversion rate',
        short_title: 'Trial-to-paid conversion rate',
        description:
          'The percentage of free trials that have converted to active paying customers over time. ',
        formats: {
          y0: '%%',
        },
        defaults: {
          interval: 'week',
          range: 3,
          graph: 'line',
          y_format: '>-.2f',
        },
      },
      {
        slug: 'average-sales-cycle',
        title: 'Average Sales Cycle Length',
        short_title: 'Average Cycle',
        description:
          'The average number of days taken for a lead to convert into an active paying customer.',
        formats: {
          y0: '% days',
        },
        defaults: {
          interval: 'day',
          range: 2,
          graph: 'bar',
          y_format: '>-.2f',
        },
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
        formats: {
          y0: '% subscribers',
        },
        defaults: {
          interval: 'day',
          range: 1,
          graph: 'line',
        },
      },
      {
        slug: 'average-sale',
        title: 'Average Sale Price',
        short_title: 'Average Sale Price',
        description:
          'The average MRR of new customers at the moment they convert to a paid account.',
        formats: {
          y0: '$%',
        },
        defaults: {
          interval: 'week',
          range: 2,
          graph: 'line',
          y_format: '>-.2f',
        },
      },
      {
        slug: 'customer-lifetime-value',
        title: 'Customer Lifetime Value',
        short_title: 'Customer Lifetime Value',
        description: 'An estimate of the total subscription value of an average customer.',
        formats: {
          y0: '$%',
        },
        defaults: {
          interval: 'week',
          range: 2,
          graph: 'bar',
          y_format: '>-.2f',
        },
      },
      {
        slug: 'subscriptions',
        title: 'Subscriptions',
        short_title: 'Subscriptions',
        description: 'The number of active, paid subscriptions.',
        formats: {
          y0: '% subscriptions',
        },
        defaults: {
          interval: 'day',
          range: 1,
          graph: 'line',
        },
      },
      {
        slug: 'average-revenue-per-subscription',
        title: 'Average Revenue Per Subscription',
        short_title: 'Average Revenue Per Subscription',
        description: 'The average MRR across your active customers. (aka ARPU & ARPC)',
        formats: {
          y0: '$%',
        },
        defaults: {
          interval: 'day',
          range: 2,
          graph: 'bar',
          y_format: '>-.2f',
        },
      },
    ],
  },
]

export default {
  report_groups,
  reports: report_groups.map((g) => g.reports).flat(),
}

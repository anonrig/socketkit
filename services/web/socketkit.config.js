const report_groups = [
  {
    name: 'Revenue',
    reports: [
      {
        defaults: {
          graph: 'bar',
          interval: 'day',
          range: 2,
          y_format: '>-.2f',
        },
        description: 'Daily revenues include your normalized total sales including your refunds.',
        formats: {
          y0: '$%',
        },
        short_title: 'Revenue',
        slug: 'revenue',
        title: 'Revenue',
      },
      {
        defaults: {
          graph: 'bar',
          interval: 'month',
          range: 3,
          y_format: '>-.2f',
        },
        description: 'Recurring revenue is a calculation of your normalised (amortized) revenue.',
        formats: {
          y0: '$%',
        },
        short_title: 'Recurring Revenue',
        slug: 'recurring-revenue',
        title: 'Recurring Revenue',
      },
    ],
  },
  {
    name: 'Leads & Trials',
    reports: [
      {
        defaults: {
          graph: 'line',
          interval: 'day',
          range: 1,
        },
        description: 'The number of new free trials started over time',
        formats: {
          y0: '% leads',
        },
        short_title: 'Trials',
        slug: 'trials',
        title: 'Free Trials',
      },
      {
        defaults: {
          graph: 'line',
          interval: 'week',
          range: 3,
          y_format: '>-.2f',
        },
        description:
          'The percentage of free trials that have converted to active paying customers over time. ',
        formats: {
          y0: '%%',
        },
        short_title: 'Trial-to-paid conversion rate',
        slug: 'trial-to-paid',
        title: 'Trial-to-paid conversion rate',
      },
      {
        defaults: {
          graph: 'bar',
          interval: 'day',
          range: 2,
          y_format: '>-.2f',
        },
        description:
          'The average number of days taken for a lead to convert into an active paying customer.',
        formats: {
          y0: '% days',
        },
        short_title: 'Average Cycle',
        slug: 'average-sales-cycle',
        title: 'Average Sales Cycle Length',
      },
    ],
  },
  {
    name: 'Subscribers',
    reports: [
      {
        defaults: {
          graph: 'line',
          interval: 'day',
          range: 1,
        },
        description: 'The number of active paying subscribers.',
        formats: {
          y0: '% subscribers',
        },
        short_title: 'Subscribers',
        slug: 'subscribers',
        title: 'Subscribers',
      },
      {
        defaults: {
          graph: 'line',
          interval: 'week',
          range: 2,
          y_format: '>-.2f',
        },
        description:
          'The average MRR of new customers at the moment they convert to a paid account.',
        formats: {
          y0: '$%',
        },
        short_title: 'Average Sale Price',
        slug: 'average-sale',
        title: 'Average Sale Price',
      },
      {
        defaults: {
          graph: 'bar',
          interval: 'week',
          range: 2,
          y_format: '>-.2f',
        },
        description: 'An estimate of the total subscription value of an average customer.',
        formats: {
          y0: '$%',
        },
        short_title: 'Customer Lifetime Value',
        slug: 'customer-lifetime-value',
        title: 'Customer Lifetime Value',
      },
      {
        defaults: {
          graph: 'line',
          interval: 'day',
          range: 1,
        },
        description: 'The number of active, paid subscriptions.',
        formats: {
          y0: '% subscriptions',
        },
        short_title: 'Subscriptions',
        slug: 'subscriptions',
        title: 'Subscriptions',
      },
      {
        defaults: {
          graph: 'bar',
          interval: 'day',
          range: 2,
          y_format: '>-.2f',
        },
        description: 'The average MRR across your active customers. (aka ARPU & ARPC)',
        formats: {
          y0: '$%',
        },
        short_title: 'Average Revenue Per Subscription',
        slug: 'average-revenue-per-subscription',
        title: 'Average Revenue Per Subscription',
      },
    ],
  },
]

export default {
  report_groups,
  reports: report_groups.map((g) => g.reports).flat(),
}

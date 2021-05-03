export const templates = {
  review: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      country_id: { type: 'string', example: 'US' },
      score: { type: 'number', min: 1, max: 5, example: 3 },
      sent_at: { type: 'string', format: 'date-time' },
      application_title: { type: 'string' },
      application_icon: { type: 'string', format: 'url' },
      review_url: { type: 'string', format: 'url' },
    },
    required: [
      'username',
      'title',
      'content',
      'country_id',
      'score',
      'sent_at',
      'application_title',
      'application_icon',
      'review_url',
    ],
    errorMessage: {
      type: 'should be an object',
      required: {
        username: 'username is required',
        title: 'title is required',
        content: 'content is required',
        country_id: 'country id is required',
        score: 'score is required and should be between 1 and 5',
        sent_at: 'sent at date is required',
        application_title: 'application title is required',
        application_icon:
          'application icon is required and should be a valid link',
        review_url: 'review url is required and should be a valid link',
      },
    },
  },
}

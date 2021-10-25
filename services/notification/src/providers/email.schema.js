export const templates = {
  free_trial_started: {
    id: 'd-820b0d6639b6477a960743f2b1f71a16',
    schema: {
      type: 'object',
      properties: {
        free_trial_start_link: { type: 'string', format: 'email' },
      },
      required: ['free_trial_start_link'],
      errorMessage: {
        type: 'should be a valid link',
        required: 'link is required',
      },
    },
  },
}

export default {
  type: 'object',
  properties: {
    template_name: {
      type: 'string',
      values: ['free_trial_started'],
    },
    template_properties: { type: 'string' },
    subject: { type: 'string' },
    from: { type: 'string', format: 'email', default: 'hello@socketkit.com' },
    to: { type: 'string', format: 'email' },
    reply_to: {
      type: 'string',
      format: 'email',
      default: 'support@socketkit.com',
    },
  },
  required: ['template_name', 'template_properties', 'subject', 'to'],
  errorMessage: {
    type: 'should be an object',
    required: {
      template_name: 'valid sendgrid template name is required',
      template_properties: 'valid sendgrid template properties are required',
      subject: 'subject is required',
      to: 'to field is required',
    },
  },
}

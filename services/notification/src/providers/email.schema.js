export const templates = {
  free_trial_started: {
    id: 'd-820b0d6639b6477a960743f2b1f71a16',
    schema: {
      errorMessage: {
        required: 'link is required',
        type: 'should be a valid link',
      },
      properties: {
        free_trial_start_link: { format: 'email', type: 'string' },
      },
      required: ['free_trial_start_link'],
      type: 'object',
    },
  },
}

export default {
  errorMessage: {
    required: {
      subject: 'subject is required',
      template_name: 'valid sendgrid template name is required',
      template_properties: 'valid sendgrid template properties are required',
      to: 'to field is required',
    },
    type: 'should be an object',
  },
  properties: {
    from: { default: 'hello@socketkit.com', format: 'email', type: 'string' },
    reply_to: {
      default: 'support@socketkit.com',
      format: 'email',
      type: 'string',
    },
    subject: { type: 'string' },
    template_name: {
      type: 'string',
      values: ['free_trial_started'],
    },
    template_properties: { type: 'string' },
    to: { format: 'email', type: 'string' },
  },
  required: ['template_name', 'template_properties', 'subject', 'to'],
  type: 'object',
}

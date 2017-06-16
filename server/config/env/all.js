const production = process.env.NODE_ENV === 'production'

const protocol = production ? 'https' : 'http'
const host = process.env.HOST_NAME || 'localhost'
const port = process.env.PORT || 3000

const url = `${protocol}://${host}` + production ? '' : `:${port}`

export default {
  protocol: process.env.PROTOCOL || protocol,
  host,
  port,
  templateEngine: 'nunjucks',
  sessionCollection: 'sessions',
  oauth: {
    googleCallbackURL: `${url}/api/auth/google/callback`
  },
  sendpulse: {
    name: 'FoodBank App', // TODO: get this from settings
    email: process.env.SENDPULSE_EMAIL || 'a2388865@mvrht.net',
    TOKEN_STORAGE: '/tmp/'
  }
}

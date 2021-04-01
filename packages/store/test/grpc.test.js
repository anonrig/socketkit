import store from './client.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

const TEST_ACCOUNT_ID = 'd5999420-8cf7-4b38-87c8-a5c751696ff4'
const TEST_APPLICATION_ID = '1541177024'

beforeAll((done) => {
  logger.pauseLogs()
  app.start(`0.0.0.0:${config.port}`)
  done()
})

afterAll(async (done) => {
  await app.close()
  done()
})

describe('create', () => {
  test('should create facebook', (done) => {
    store.create(
      {
        rows: [
          {
            application_id: '284882215',
            default_country_id: 'us',
            default_language_id: 'EN',
          },
        ],
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response.row).toEqual(undefined)
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})

describe('findAll', () => {
  test('should find by application_ids', (done) => {
    store.findAll({ application_ids: ['284882215'] }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        expect(response.rows.length).toEqual(1)
        response.rows.forEach((row) => {
          expect(row.application_id).toBe('284882215')
          expect(row.bundle_id).toBe('com.facebook.Facebook')
        })
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test('should find by bundle_ids', (done) => {
    store.findAll(
      { bundle_ids: ['com.facebook.Facebook'] },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeInstanceOf(Object)
          expect(response.rows).toBeInstanceOf(Array)
          expect(response.rows.length).toEqual(1)
          expect(response.rows[0].application_id).toBe('284882215')
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })

  test('should find by developer_ids', (done) => {
    store.findAll({ developer_ids: ['284882218'] }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.rows).toBeInstanceOf(Array)
        expect(response.rows.length).toEqual(1)
        expect(response.rows[0].application_id).toBe('284882215')
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('findOne', () => {
  test('should return facebook', (done) => {
    store.findOne({ application_id: '284882215' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.row.application_id).toBe('284882215')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test('should return null on not found', (done) => {
    store.findOne({ application_id: '1234512345' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.row).toBe(null)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('findVersions', () => {
  test('should return versions', (done) => {
    store.findVersions({ application_id: '284882215' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach((version) => {
          expect(version.version).toBeDefined()
          expect(version.released_at).toBeDefined()
        })
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test('should return empty array', (done) => {
    store.findVersions({ application_id: '1234512345' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.rows).toBeInstanceOf(Array)
        expect(response.rows.length).toEqual(0)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('findReviews', () => {
  test('should return reviews', (done) => {
    store.findReviews({ application_id: '284882215' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.rows).toBeDefined()
        expect(response.rows).toBeInstanceOf(Array)
        response.rows.forEach((version) => {
          expect(version.application_id).toEqual('284882215')
        })
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('createIntegration', () => {
  test('should create', (done) => {
    store.createIntegration(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
        country_id: 'us',
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})

describe('findIntegrations', () => {
  test('should find all integrations', (done) => {
    store.findIntegrations(
      {
        account_id: TEST_ACCOUNT_ID,
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeDefined()
          expect(response.rows).toBeInstanceOf(Array)
          response.rows.forEach((integration) => {
            expect(integration.account_id).toEqual(TEST_ACCOUNT_ID)
            expect(integration.application_title).toBeDefined()
            expect(integration.application_icon).toBeDefined()
          })
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})

describe('findIntegration', () => {
  test('should find one integration', (done) => {
    store.findIntegration(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: TEST_APPLICATION_ID,
        country_id: 'us',
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeDefined()
          expect(response.row.account_id).toEqual(TEST_ACCOUNT_ID)
          expect(response.row.application_id).toEqual(TEST_APPLICATION_ID)
          expect(response.row.application_title).toBeDefined()
          expect(response.row.application_icon).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})

describe('deleteIntegration', () => {
  test('should find one integration', (done) => {
    store.deleteIntegration(
      {
        account_id: TEST_ACCOUNT_ID,
        application_id: 'hello',
        country_id: 'us',
      },
      (error, response) => {
        try {
          expect(error).toBeNull()
          expect(response).toBeDefined()
          done()
        } catch (error) {
          done(error)
        }
      },
    )
  })
})

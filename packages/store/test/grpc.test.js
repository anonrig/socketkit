import store from './client.js'
import config from '../src/config.js'
import logger from '../src/logger.js'
import app from '../src/grpc.js'

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
        application_id: '284882215',
        country_id: 'us',
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
        expect(response.rows[0].application_id).toBe('284882215')
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
          expect(version.application_id).toEqual('284882215')
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

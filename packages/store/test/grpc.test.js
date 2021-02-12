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
    store.create({ application_id: '284882215' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.application).toEqual(undefined)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

describe('findAll', () => {
  test('should return facebook', (done) => {
    store.findAll({ application_ids: ['284882215'] }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response).toBeInstanceOf(Object)
        expect(response.applications).toBeInstanceOf(Array)
        expect(response.applications.length).toEqual(1)
        expect(response.applications[0].application_id).toBe('284882215')
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
        expect(response.application.application_id).toBe('284882215')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  test('should return undefined', (done) => {
    store.findOne({ application_id: '1234512345' }, (error, response) => {
      try {
        expect(error).toBeNull()
        expect(response.application).toBe(null)
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
        expect(response.versions).toBeInstanceOf(Array)
        response.versions.forEach((version) => {
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
        expect(response.versions).toBeInstanceOf(Array)
        expect(response.versions.length).toEqual(0)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
})

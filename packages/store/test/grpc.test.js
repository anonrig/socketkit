import store from './grpc.client.js'

beforeAll(async (done) => {
  store.create({ application_id: '284882215', country_id: 'us' }, (error) =>
    done(error),
  )
})
describe('findOne', () => {
  test('should return facebook', () => {
    store.findOne({ application_id: '284882215' }, (error, response) => {
      expect(error).toBe(null)
      expect(response.application_id).toBe('284882215')
    })
  })

  test('should return undefined', () => {
    store.findOne({ application_id: '1234512345' }, (error, response) => {
      expect(response).toBe(undefined)
    })
  })
})

describe('findVersions', () => {
  test('should return versions', () => {
    store.findVersions({ application_id: '284882215' }, (error, response) => {
      expect(error).toBe(null)
      expect(response.versions).toBeInstanceOf(Array)
      response.versions.forEach((version) => {
        expect(version.application_id).toEqual('284882215')
      })
    })
  })
  test('should return empty array', () => {
    store.findVersions({ application_id: '1234512345' }, (error, response) => {
      expect(error).toBe(null)
      expect(response.versions).toBeInstanceOf(Array)
      expect(response.versions.length).toEqual(0)
    })
  })
})

describe('process', () => {
  test('should process', () => {
    store.process(
      { application_id: '284882215', country_id: 'us' },
      (error, response) => {
        expect(error).toBe(null)
        expect(response).toEqual({})
      },
    )
  })

  test('should throw error if not found', () => {
    store.process(
      { application_id: '123456123456', country_id: 'tr' },
      (error, response) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('not found')
        expect(response).toBe(undefined)
      },
    )
  })
})

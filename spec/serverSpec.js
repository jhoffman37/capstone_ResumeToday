const { testResume } = require('../target/server.js')

describe('resume server', function () {
  const baseUrl = 'http://localhost:5163'
  const shouldBeAbove200 = async function (route) {
    it('should be above 200', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeGreaterThanOrEqual(200)
    }, 10000)
  }
  const shouldBeLessThan500 = async function (route) {
    it('should be below 500', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeLessThanOrEqual(500)
    }, 10000)
  }
  describe("GET '/health'", function () {
    shouldBeAbove200('/health')
  })
  describe("GET '/health'", function () {
    shouldBeLessThan500('/health')
  })
  describe("GET '/'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/'", function () {
    shouldBeLessThan500('/')
  })
  describe("GET '/views'", function () {
    shouldBeAbove200('/views')
  })
  describe("GET '/views'", function () {
    shouldBeLessThan500('/views')
  })
  describe("GET '/user'", function () {
    shouldBeAbove200('/user')
  })
  describe("GET '/user'", function () {
    shouldBeLessThan500('/user')
  })
})

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('supertest')
const cheerio = require('cheerio')

const db = require('../models/index')
const app = require('../app')

let server, agent

function extractCsrfToken (res) {
  const $ = cheerio.load(res.text)
  return $('[name=_csrf]').val()
}

describe('Todo Application', function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(process.env.PORT || 3000, () => {})
    agent = request.agent(server)
  })
  afterAll(async () => {
    try {
      await db.sequelize.close()
      await server.close()
    } catch (error) {
      console.log(error)
    }
  })
  test('Test for creating a to-do', async () => {
    const res = await agent.get('/')
    const csrfToken = extractCsrfToken(res)
    const response = await agent.post('/todos').send({
      title: 'Sample todo 1',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    })
    expect(response.statusCode).toBe(302)
  })
  test('Test for updating a to-do', async () => {
    const res = await agent.get('/')
    let csrfToken = extractCsrfToken(res)
    await agent.post('/todos').send({
      title: 'Sample todo 2',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    })
    const gropuedTodosResponse = await agent.get('/').set('Accept', 'application/json')
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text)

    const dueTodayCount = parsedGroupedResponse.dueToday.length
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1]

    const boolStatus = !latestTodo.completed
    const anotherRes = await agent.get('/')
    csrfToken = extractCsrfToken(anotherRes)

    const changeTodo = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus })

    const UpadteTodoItemParse = JSON.parse(changeTodo.text)
    expect(UpadteTodoItemParse.completed).toBe(true)
  })
  test('Test for deleting a to-do', async () => {
    const res = await agent.get('/')
    let csrfToken = extractCsrfToken(res)
    await agent.post('/todos').send({
      title: 'Sample todo 3',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    })
    const gropuedTodosResponse = await agent.get('/').set('Accept', 'application/json')
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text)

    const dueTodayCount = parsedGroupedResponse.dueToday.length
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1]

    const boolStatus = !latestTodo.completed
    const anotherRes = await agent.get('/')
    csrfToken = extractCsrfToken(anotherRes)

    const changeTodo = await agent
      .delete(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus })

    const boolResponse = Boolean(changeTodo.text)
    expect(boolResponse).toBe(true)
  })

  test('Test for marking an item as incomplete', async () => {
    const res = await agent.get('/')
    let csrfToken = extractCsrfToken(res)
    await agent.post('/todos').send({
      title: 'Sample todo 4',
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken
    })
    const gropuedTodosResponse = await agent.get('/').set('Accept', 'application/json')
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text)

    const dueTodayCount = parsedGroupedResponse.dueToday.length
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1]

    const boolStatus = !latestTodo.completed
    let anotherRes = await agent.get('/')
    csrfToken = extractCsrfToken(anotherRes)

    const changeTodo = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: boolStatus })

    const UpadteTodoItemParse = JSON.parse(changeTodo.text)
    expect(UpadteTodoItemParse.completed).toBe(true)

    anotherRes = await agent.get('/')
    csrfToken = extractCsrfToken(anotherRes)

    const changeTodo2 = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: !boolStatus })

    const UpadteTodoItemParse2 = JSON.parse(changeTodo2.text)
    expect(UpadteTodoItemParse2.completed).toBe(false)
  })
})

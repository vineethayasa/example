const express = require('express')
const csrf = require('csurf')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
app.use(bodyParser.json())
const path = require('path')
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('shh! some secret string'))
app.use(csrf({ cookie: true }))

const { Todo } = require('./models')

app.set('view engine', 'ejs')
app.get('/', async (request, response) => {
  const allTodos = await Todo.getTodos()
  const overdue = await Todo.overdue()
  const dueLater = await Todo.dueLater()
  const dueToday = await Todo.dueToday()
  const completedItems = await Todo.completedItems()
  if (request.accepts('html')) {
    response.render('index', {
      allTodos,
      overdue,
      dueLater,
      dueToday,
      csrfToken: request.csrfToken(),
      completedItems
    })
  } else {
    response.json({ overdue, dueLater, dueToday, completedItems })
  }
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/todos', async function (_request, response) {
  console.log('Processing list of all Todos ...')
  try {
    const todos = await Todo.findAll()
    return response.send(todos)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.post('/todos', async (request, response) => {
  console.log('Creating a todo', request.body)
  try {
    const todo = await Todo.addTodo({ title: request.body.title, dueDate: request.body.dueDate, completed: false })
    return response.redirect('/')
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.put('/todos/:id', async (request, response) => {
  console.log('Mark Todo as completed:', request.params.id)
  const todo = await Todo.findByPk(request.params.id)
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed)
    return response.json(updatedtodo)
  } catch (error) {
    console.log(error)
    return response.status(422).json(error)
  }
})

app.delete('/todos/:id', async (request, response) => {
  console.log('We have to delete a todo with ID:', request.params.id)
  try {
    await Todo.remove(request.params.id)
    return response.json({ success: true })
  } catch (error) {
    return response.status(422).json(error)
  }
})

module.exports = app

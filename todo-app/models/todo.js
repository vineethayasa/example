'use strict'
const {
  Model, Op
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }

    static addTodo ({ title, dueDate, userId }) {
      return this.create({ title, dueDate, completed: false, userId })
    }

    markAsCompleted () {
      return this.update({ completed: true })
    }

    static getTodos () {
      return this.findAll()
    }

    static async remove (id, userId) {
      return this.destroy({
        where: {
          id,
          userId
        }
      })
    }

    static overdue (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().slice(0, 10)
          },
          userId,
          completed: false
        },
        order: [['id', 'ASC']]
      })
    }

    static dueToday (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().slice(0, 10)
          },
          userId,
          completed: false
        },
        order: [['id', 'ASC']]
      })
    }

    static dueLater (userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().slice(0, 10)
          },
          userId,
          completed: false
        },
        order: [['id', 'ASC']]
      })
    }

    static completedItems (userId) {
      return this.findAll({
        where: {
          userId,
          completed: true
        },
        order: [['id', 'ASC']]
      })
    }

    setCompletionStatus (bool) {
      return this.update({ completed: bool })
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo'
  })
  return Todo
}

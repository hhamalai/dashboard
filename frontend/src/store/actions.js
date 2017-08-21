import * as types from './modules/tasks/mutation-types'

export const newTask = ({ commit }, task) => {
  commit(types.ADD_TO_CART, {
    id: task.id
  })
}

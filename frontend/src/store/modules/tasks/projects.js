import * as types from './mutation-types'
import tasks from '../../../api/tasks'
import Vue from 'vue'

const state = {
  projects: {
    backlog: [],
    inProgress: [],
    done: [],
    archieved: []
  },
  tasks: {
    backlog: [],
    inProgress: [],
    done: [],
    archieved: []
  },
  loading: true,
  detailsDialogOpen: false,
  selectedItem: {
    type: 0,
    item: {
      title: ''
    }
  }
}
const setters = {
  updateTask: (task, lane) => {
    Vue.http.put('http://localhost:5000/api/v1/tasks/' + task['id'], {
      title: task['title'],
      lane: lane
    }).then(
        function(response) {})
  },
  moveProject: (project, lane) => {
    Vue.http.put('http://localhost:5000/api/v1/projects/' + project['id'], {
        title: project['title'],
        lane: lane
    }).then(
      function(response) {})
  },
}
const getters = {
  allProjects: state => {console.log("projects", state.projects); state.projects},
  allTasks: state => {console.log("tasks", state.tasks); state.tasks},
  allTasksForLane: state => lane => {console.log(state.tasks[lane]); state.tasks[lane]},
  hasDetailsDialogOpen: state => {
    console.log("getters state is: " + state.detailsDialogOpen)
    return state.detailsDialogOpen;
  }
}
const actions = {
  openDetailsDialog({ commit }, isOpen) {
    console.log("openDetailsDialog", isOpen)
    commit(types.OPEN_DETAILS_DIALOG, isOpen)
  },
  getProjects({ commit }) {
    tasks.getProjects(projects => {
      console.log("getProjects", projects)
      commit(types.RECEIVE_PROJECTS, { projects })
    })
  },
  fetchData ({ commit }) {
    Vue.http({
      url: 'http://localhost:5000/api/v1/todo',
      method: 'GET'
    }).then(function (response) {
      commit(types.RECEIVE_PROJECTS, { projects: response.data })
    }, function (error) {
      console.log('error while getting data', error)
    })
  },
  addNewProject({commit}, lane) {
    console.log("new project on lane=", lane)
    Vue.http.post('http://localhost:5000/api/v1/projects', lane
    ).then(function (response) {
      commit(types.NEW_PROJECT, { lane: lane.lane, project: response.data })
    }, function (error) {
      console.log('error while adding new project', error)
    })
  },
  editProjectTitle({commit}, project) {
    commit(types.START_RENAME_PROJECT, project)
    //commit(types.RENAME_PROJECT, project)
  },
  moveProject({ commit }, project) {
    commit(types.MOVE_PROJECT, {
      value: project.value,
      from: project.lane,
    })
    if (project.value.length) setters.moveProject(project.value[project.value.length-1], project.lane)
  },
  moveTask({ commit }, task) {
    commit(types.MOVE_TASK, {
      value: task.value,
      from: task.lane,
    })
    if (task.value.length) setters.updateTask(task.value[project.value.length-1], task.lane)
  },
  addChildTask({ commit }, task) {
    commit(types.ADD_TASK, {
      lane: task.lane,
      title: 'untitled',
      parent: task.id
    })
  },
  selectProject({ commit }, conf) {
    console.log("action, select project", conf.isOpen, conf.task)
    commit(types.OPEN_DETAILS_DIALOG, {
      isOpen: conf.isOpen,
      id: conf.task.id,
      selectedItem: {
        item: conf.task,
        lane: conf.lane,
        type: 0
      }
    })
  },
  updateSelectedItem({ commit }, partial) {
    console.log("updateSelectedItem", partial)
    commit(types.UPDATE_SELECTED_ITEM, partial)
  },
  storeSelectedItem({commit}, project) {
    console.log("action", project)
    Vue.http.put('http://localhost:5000/api/v1/projects/' + project['id'], project).then(
      function(response) {
        commit(types.STORE_SELECTED_ITEM)
      }
    )
  },
  detailsDialogOpen({ commit }, isOpen) {
    commit(types.OPEN_DETAILS_DIALOG, {
      isOpen: isOpen
    })
  },
  closeDetailsDialog({ commit }) {
    console.log("close details dialog")
    //commit(types.CLOSE_DETAILS_DIALOG)
  },
  deleteProject({ commit }, project) {
    console.log("Mutation, delete project", project)
    Vue.http({
      url: 'http://localhost:5000/api/v1/projects/' + project.id,
      method: 'DELETE'
    }).then(function (response) {
      commit(types.DELETE_PROJECT, {
        id: project.id,
        lane: project.lane
      })
    }, function (error) {
      console.log('error while deleting projects', error)
    })
  },
  deleteTask({ commit }, task) {
    commit(types.DELETE_TASK, {
      id: task.id,
      lane: task.lane
    })
  }

}

const mutations = {
  [types.RECEIVE_PROJECTS] (state, { projects }) {
    console.log("mutations", projects)
    state.projects = projects.projects
    state.tasks = projects.tasks
    state.selectedProject = null
  },

  [types.ADD_TASK] (state, task) {
    console.log("mutation", state, task)
    state.tasks.backlog.push(Object.assign({}, task))
  },

  [types.NEW_PROJECT] (state, project) {
    console.log("NEW_PROJECT")
    console.log(project.project)
    console.log(state.projects)
    state.projects[project.lane].push(project.project)
  },
  [types.START_RENAME_PROJECT] (state, project) {

  },
  [types.RENAME_PROJECT] (state, project) {
    state.projects[project.lane] = state.projects[project.lane].map(p => {
      if (p.id === project.id) return project
      else return p
    })
  },
  [types.MOVE_PROJECT] (state, obj) {
    console.log("Move project", state, obj)
    state.projects[obj.from] = obj.value
  },

  [types.MOVE_TASK] (state, obj) {
    console.log("Move task", state, obj)
    state.tasks[obj.from] = obj.value
  },

  [types.SELECT_PROJECT] (state, object) {
    state.selectedProject = object.id
  },

  [types.DELETE_TASK] (state, obj) {
    state.tasks[obj.lane] = state.tasks[obj.lane].filter(p => p.id != obj.id)
  },

  [types.DELETE_PROJECT] (state, obj) {
    state.projects[obj.lane] = state.projects[obj.lane].filter(p => p.id != obj.id)
  },
  [types.OPEN_DETAILS_DIALOG] (state, obj) {
    console.log("mutate details dialog open", obj)
    state.detailsDialogOpen = obj.isOpen
    if (obj.selectedItem) {
      state.selectedItem.item = JSON.parse(JSON.stringify(obj.selectedItem.item));
      state.selectedItem.lane = obj.selectedItem.lane
    }
  },
  [types.UPDATE_SELECTED_ITEM] (state, obj) {
    state.selectedItem.item = Object.assign(state.selectedItem.item, obj)
  },
  [types.STORE_SELECTED_ITEM] (state) {
    for (var i=0; i < state.projects[state.selectedItem.lane].length; i++) {
      console.log("checking", state.projects[state.selectedItem.lane][i].id)
      if (state.projects[state.selectedItem.lane][i].id === state.selectedItem.item.id) {
        console.log("replacing")
        state.projects[state.selectedItem.lane][i].title = state.selectedItem.item.title
        state.projects[state.selectedItem.lane][i].description = state.selectedItem.item.description
        state.projects[state.selectedItem.lane][i].deadline = state.selectedItem.item.deadline
        state.projects[state.selectedItem.lane][i].color = state.selectedItem.item.color
        state.projects[state.selectedItem.lane][i].labelValue = state.selectedItem.item.labelValue
      }
    }
  },
  [types.CLOSE_DETAILS_DIALOG] (state, obj) {
    console.log("mutate details dialog close")
    state.detailsDialogOpen = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

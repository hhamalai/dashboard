const _projects = {
  projects: {
    backlog: [{title: 'foobar1', id: 1}, {title: 'abc', id: 2}, {title: 'kekkonen', id: 5}],
    inProgress: [{title: 'foo', id: 4}, {title: 'element.io', id: 6}],
    done: [],
    archieved: []
  },
  tasks: {
    backlog: [{title: 'foobar2', id: 3, project: 1}],
    inProgress: [{title: "barbar", id: 1, project: 2}],
    done: [],
    archieved: []
  }
}

export default {
  getProjects (cb) {
    setTimeout(() => cb(_projects), 100)
  }
}

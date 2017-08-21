<template>
  <div>
    <draggable class="dragArea" v-model="projects" :options="{group: 'projects'}" @start="drag=true" @end="drag=false">
      <div v-bind:style="{ background: project.color }" class="dragItem" v-for="project in projects" :key="project.id">
        <div>
          <el-button-group class="pull-right">
            <el-button icon="plus" v-on:click="addChildTaskComp(project)" size="mini"></el-button>
            <el-button icon="delete" @click="removeProject(project)" size="mini"></el-button>
          </el-button-group>
        </div>

        <h2 v-if="!project.editMode" @click="selectProject(true, project)">{{project.title}}</h2>
        <input v-else type="text">
      </div>
    </draggable>
    <a @click="addNewProject">Add new...</a>

  </div>
</template>

<style>
  .addItemInput {
    width: 100%;
    margin-top: 0;
    padding-top: 0;
  }
	.dragArea {
    min-height: 100px;
    border: 1px solid #ccc;
  }
  .dragItem {
    background: #ddd;
    min-height: 22px;
  }
  .dragItem h2 {
    padding: 0px;
    margin: 0px;
  }
  [draggable] {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    /* Required to make elements draggable in old WebKit */
    -khtml-user-drag: element;
    -webkit-user-drag: element;
  }

  div.dragItem input {
    width: 75%;
    padding: 0;
    margin: 0;
    border: 0;
    background-color: #faf2cc;

  }
</style>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import store from '../store'
import draggable from 'vuedraggable'
export default {
  name: 'Task',
	props: ['lane', 'title'],
  components: {draggable},
  methods: {
    removeProject(project) {
      this.$store.dispatch('projects/deleteProject', {lane: this.lane, id: project.id})
    },
    addNewProject() {
      this.$store.dispatch('projects/addNewProject', {lane: this.lane})
    },
    addChildTaskComp(task) {
      this.$store.dispatch('projects/addChildTask', {lane: this.lane, id: task.id})
    },
    editProjectTitle(project) {
      this.$store.dispatch('projects/editProjectTitle', project)
    },
    openTask() {
      console.log("open task");
    },
    selectProject(isOpen, task) {
      console.log("select project", isOpen, task)
      this.$store.dispatch('projects/selectProject', {
        isOpen: isOpen,
        task: task,
        lane: this.lane
      })
    },
    ...mapActions([
      'projects/moveTask',
      'projects/addChildTask',
      'projects/selectProject'
    ])
  },
	computed: {

    activeColor: {
      get() {
        console.log("Active Color")
        return "red"
      }
    },
    projects: {
      get() {
        console.log("getter", this)
        console.log(store.state.projects.projects[this.lane])
				return store.state.projects.projects[this.lane]
      },
      set(value) {
        var x = {value: value, lane: this.lane}
        console.log("x=", x)
        this.$store.dispatch('projects/moveProject', x)
      }
		}
  }
}
</script>

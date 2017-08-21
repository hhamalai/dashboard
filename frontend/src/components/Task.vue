<template>
	<draggable class="dragArea"  v-model="tasks" :options="{group:'tasks'}" @start="drag=true" @end="drag=false">
    <div class="dragItem" v-for="task in tasks" :key="task.id">
      <div>
        <el-button-group class="pull-right">
          <el-button icon="plus" v-on:click="addChildTaskComp(task)" size="mini"></el-button>
          <el-button icon="search" @click="selectProject(task)" size="mini"></el-button>
          <el-button icon="delete" @click="removeTask(task)" size="mini"></el-button>
        </el-button-group>
      </div>

      <h2 v-on:click="rename(task)">{{task.title}}</h2>
    </div>
	</draggable>
</template>

<style>

</style>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import store from '../store'
import draggable from 'vuedraggable'
export default {
  name: 'Task',
	props: ['lane'],
  components: {draggable},
	computed: {
    tasks: {
      //console.log("tasks", this.$store.state.projects.tasks[this.lane])
      //console.log("getter", this.$store.getters)
      get() {
        console.log("task getter", this)
        return store.state.projects.tasks[this.lane]
      },
      set(value) {
        var x = {value: value, lane: this.lane}
        console.log("task x=", x)
        this.$store.dispatch('projects/moveTask', x)
      }
      //return this.$store.state.projects.tasks[this.lane].find((item) => item.project == this.$store.state.projects.selectedProject)
    },
    selectedProject() {
      console.log("selectedProject", this.$store.state.projects.getters)
      return this.$store.state.projects.selectedProject
    },
    removeTask() {

    },
		tasksByLane() {
      console.log("TasksByLane", this.$store.state)
		  var tasks = this.$store.state.projects.tasks[this.lane]
      console.log("tasksByLane", this.$store.state.projects)
		  if (this.$store.state.projects.selectedProject) {
        tasks = tasks.filter(task => task.project == this.$store.state.projects.selectedProject)
      }
      return tasks
		}
  },
  methods: {
    rename(task) {
      console.log("rename", task)
      this.$store.dispatch('projects/renameTask', task, "renamed")
    }
  }
}
</script>

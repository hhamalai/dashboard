<template>
  <div>
    <h2>Projects</h2>
    <div class="row">
      <div class="col-md-3">Backlog</div>
      <div class="col-md-3">In progress</div>
      <div class="col-md-3">Done</div>
      <div class="col-md-3">Archieved</div>
    </div>
    <div class="row">
      <div class="col-md-3 drag">
				<project class="dragArea" :options="{group:'projects'}" lane="backlog"> </project>
      </div>
      <div class="col-md-3 drag">
				<project class="dragArea" :options="{group:'projects'}" lane="inProgress"> </project>
      </div>
      <div class="col-md-3 drag">
				<project class="dragArea" :options="{group:'projects'}" lane="done"> </project>
      </div>
      <div class="col-md-3 drag">
				<project class="dragArea" :options="{group:'projects'}" lane="archieved"> </project>
      </div>
    </div>

    <h2>Tasks</h2>
    <div class="row">
      <div class="col-md-3">Backlog</div>
      <div class="col-md-3">In progress</div>
      <div class="col-md-3">Done</div>
      <div class="col-md-3">Archieved</div>
    </div>
		<div class="row">
      <div class="col-md-3 drag">
				<task class="dragArea" :options="{group:'tasks'}" lane="backlog"> </task>
      </div>
      <div class="col-md-3 drag">
				<task class="dragArea" :options="{group:'tasks'}" lane="inProgress"> </task>
      </div>
      <div class="col-md-3 drag">
				<task class="dragArea" :options="{group:'tasks'}" lane="done"> </task>
      </div>
      <div class="col-md-3 drag">
				<task class="dragArea" :options="{group:'tasks'}" lane="archieved"> </task>
      </div>
		</div>
    value dv: {{ dialogVisible }}
    <el-dialog
        title="Details"
        :visible.sync="dialogVisible"
        size="tiny"
        :before-close="handleClose">
      {{ selectedItem }}<br />
      <el-form ref="form" label-width="120px">
        <el-form-item label="Title">
          <el-input v-model="title"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="description"></el-input>
        </el-form-item>
        <el-form-item label="Deadline">
          <el-date-picker
              v-model="deadline"
              type="datetime"
              placeholder="Select date and time">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Color">
          <el-color-picker v-model="color"></el-color-picker>
        </el-form-item>
        <el-form-item label="Labels">
          <el-cascader
              :options="labelOptions"
              v-model="labelValues">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="save()" type="primary">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import Task from './Task.vue'
import Project from './Project.vue'
export default {
  data() {
    return {
      labelOptions: [{
        value: 'planning',
        label: 'Planning',
      }, {
        value: 'implementation',
        label: 'Implementation'
      }, {
        value: 'communication',
        label: 'Communication'
      }, {
        value: 'attendance',
        label: 'Attendance'
      }]
    }
  },
	components: {
    draggable,
		Task,
		Project
	},
	computed: {
    dialogVisible: {
      get: function () {
        console.log(this.$store.state.projects.detailsDialogOpen)
        return this.$store.state.projects.detailsDialogOpen
      },
      set: function(nVal) {
        console.log("new val", nVal)
        this.$store.dispatch('projects/detailsDialogOpen', nVal)
      }
    },
    title: {
      get: function() {
        console.log("selected item title", this.$store.state.projects.selectedItem.item)
        if (this.$store.state.projects.selectedItem.item)
          return this.$store.state.projects.selectedItem.item.title
        else return ""
      },
      set: function(nVal) {
        console.log("set val", nVal)
        this.$store.dispatch('projects/updateSelectedItem', { title: nVal });
      }
    },
    description: {
      get: function() {
        console.log("selected item desc", this.$store.state.projects.selectedItem.item)
        if (this.$store.state.projects.selectedItem.item)
          return this.$store.state.projects.selectedItem.item.description
        else return ""
      },
      set: function(nVal) {
        console.log("set val", nVal)
        this.$store.dispatch('projects/updateSelectedItem', { description: nVal });
      }
    },
    deadline: {
      get: function() {
        console.log("selected item deadline")
        if (this.$store.state.projects.selectedItem.item) {
          console.log("DL", this.$store.state.projects.selectedItem.item.deadline)
          return this.$store.state.projects.selectedItem.item.deadline
        }
        else return ""
      },
      set: function(nVal) {
        console.log("set val", nVal)
        this.$store.dispatch('projects/updateSelectedItem', { deadline: nVal });
      }
    },
    color: {
      get: function() {
        if (this.$store.state.projects.selectedItem.item) {
          return this.$store.state.projects.selectedItem.item.color
        } else return ""
      },
      set: function(nVal) {
        this.$store.dispatch('projects/updateSelectedItem', { color: nVal });
      }
    },
    labelValues: {
      get: function() {
        console.log("selected item labels")
        if (this.$store.state.projects.selectedItem.item)
          return this.$store.state.projects.selectedItem.item.labels
        else return []
      },
      set: function(nVal) {
        console.log("set val", nVal)
        this.$store.dispatch('projects/updateSelectedItem', { labels: nVal });
      }
    },
    ...mapGetters({
      projects: 'allProjects',
		  tasks: 'allTasks',
      allByLane: 'allTasksForLane',
    })
  },
	created () {
    //this.$store.dispatch('projects/getProjects')
    this.$store.dispatch('projects/fetchData')
  },
  methods: {
    save() {
      console.log("save");
      console.log(this.$store.state.projects.selectedItem)
      this.$store.dispatch('projects/storeSelectedItem', this.$store.state.projects.selectedItem.item)
      this.dialogVisible = false
    }
  }
}
</script>

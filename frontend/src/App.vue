<template>
    <div id="app" style="margin-top: 0px;">
        <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1"><router-link to="/" class="btn btn-lg">Dashboard</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/tasks" class="btn btn-lg">Tasks</router-link></el-menu-item>
            <el-submenu index="3">
                <template slot="title">Workspace</template>
                <el-menu-item index="3-1">item one</el-menu-item>
                <el-menu-item index="3-2">item two</el-menu-item>
                <el-menu-item index="3-3">item three</el-menu-item>
            </el-submenu>
            <el-menu-item index="4"><router-link to="/map" class="btn btn-lg">Route</router-link></el-menu-item>
        </el-menu>

        <div class="container">
            <router-view></router-view>
        </div>

    </div>
</template>
<style>
</style>
<script>
export default {
    data() {
      return {
        activeIndex: '1',
      }
    },
    methods: {
        handleSelect(key, keyPath) {
          console.log(key, keyPath);
        }
    }
}
</script>

<template>
  <div id="app">
    <img src="./assets/logo.png">

    <el-container>
      <el-header>
        <router-link to="/hello">
          <el-button type="success" round>hello world</el-button>
        </router-link>
        <router-link to="/im">
          <el-button type="success" round>im demo</el-button>

        </router-link>
        <router-link to="/webSocket">
          <el-button type="success" round>websocket demo</el-button>

        </router-link>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>

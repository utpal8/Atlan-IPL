<template>
  <div id="app">
    <el-container>
      <el-header>IPL Data Visualizations</el-header>
      <WelcomingHeader />
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import WelcomingHeader from "@/components/WelcomingHeader.vue";

export default {
  components: {
    WelcomingHeader
  }
}
</script>


<style>
.el-header {
  background-color: #5A5754;
  color: white;
  text-align: center;
  line-height: 60px;
  font-weight: bolder;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

hr {
  margin: 40px 0px 40px 0px;
}

::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
}

::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    box-shadow: 0 0 1px rgba(255,255,255,.5);
}

/* a {
  font-weight: bold;
  color: #2c3e50;
}

a.router-link-exact-active {
  color: #42b983;
} */
</style>

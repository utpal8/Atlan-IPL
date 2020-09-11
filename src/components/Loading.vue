<template>
  <div>
    <h3>Crunching Data...</h3>
    <br />
    <span v-loading="true"></span>
  </div>
</template>

<script>
export default {
  name: "Loading",
}
</script>

<style scoped>
  span {
    padding: 0px;
    left: -1.4%
  }
</style>

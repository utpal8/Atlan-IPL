<template>
  <el-card shadow="hover" class="card">
    <h3><slot name="heading"></slot></h3>
    <p><slot name="content"></slot></p>
    <p class="smaller"><slot name="content-2"></slot></p>
  </el-card>
</template>


<script>
export default {
  name: "SmartCard"
};
</script>

<style scoped>
.card {
  border: 2.4px solid #5a5754;
  margin: 4px;
  padding: 0px;
  cursor: pointer;
  background: #e8e8e8;
}

.card:hover {
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.75);
}

h3 {
  margin: 0px;
}

p {
  margin: 0px;
}
.smaller {
  margin-top: 4px;
  font-size: 80%;
}
</style>

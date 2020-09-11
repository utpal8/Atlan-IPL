<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import Chart from "chart.js";

export default {
  name: 'Chart',
  props: ["type", "dataProp", "options", "xStepSize", "yStepSize", "showlines"],
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.chart = new Chart(this.$refs.chartCanvas, {
      data: this.dataProp,
      options: {
        ...this.options,
        showLines: this.showlines
      },
      type: this.type
    });
  },
  watch: {
    dataProp: function() {
      this.chart.data = this.dataProp;
      this.chart.update();
    }
  }
}
</script>

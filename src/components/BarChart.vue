<template>
  <canvas ref="chartCanvas"></canvas>
</template>


<script>
import Chart from "chart.js";

export default {
  name: 'BarChart',
  props: ["type", "dataProp", "options", "xStepSize", "yStepSize"],
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
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: this.xStepSize
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: this.yStepSize
              }
            }
          ]
        }
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
};
</script>

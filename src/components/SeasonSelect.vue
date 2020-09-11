<template>
  <el-row :gutter="10">
    <el-col :span="6" v-for="season of seasons" :key="season.matches[0].Season_Id">
      <div @click="emitClick(season.matches[0].Season_Id)">
        <smart-card>
          <span slot="heading">Season {{ season.matches[0].Season_Id }}</span>
          <span slot="content">Total matches: {{ season.matches.length }}</span>
          <span slot="content-2">{{ `${season.startDate}|${season.endDate}` | ToFromDate }}</span>
        </smart-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import SmartCard from "@/components/SmartCard";

export default {
  name: "SeasonSelect",
  props: ["dataBySeasons"],
  components: { SmartCard },
  data() {
    return {
      seasons: []
    };
  },
  created() {
    Object.keys(this.dataBySeasons).forEach(key => {
      this.seasons.push(this.dataBySeasons[key]);
    });
  },
  methods: {
    emitClick(season) {
      this.$emit("seasonClick", season);
    }
  }
};
</script>

<template>
  <el-row>
    <el-col :span="18" :offset="3">
    <el-table
      :data="matches"
      border
      height="650"
      align="center"
      row-class-name="custom-row"
      @row-click="onMatchSelect"
    >
      <!-- <el-table-column label="Id" width="120">
        <template slot-scope="scope">
          {{ scope.row.Match_Id }}
        </template>
      </el-table-column> -->
      <el-table-column label="Date" width="120">
        <template slot-scope="scope">
          {{ scope.row.Match_Date | PlainDate }}
        </template>
      </el-table-column>
      <el-table-column label="Details" width="380">
        <template slot-scope="scope">
          <h3>
            <span :class="scope.row.Team_Name_Id == scope.row.Match_Winner_Id  ? 'winner' : 'loser'">{{ `Team_Name_${scope.row.Team_Name_Id}` }}</span>
            VS
            <span :class="scope.row.Opponent_Team_Id == scope.row.Match_Winner_Id ? 'winner' : 'loser'">{{ `Team_Name_${scope.row.Opponent_Team_Id}` }}</span>
          </h3>
          <p>{{ scope.row.Win_Type != 'Tie' ? `Team_Name_${scope.row.Match_Winner_Id} won ${scope.row.Won_By} ${scope.row.Win_Type.slice(2, scope.row.Win_Type.length)}` : scope.row.Win_Type == 'Tie' ? 'No Winner - Tie Match' : 'No Result' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Net Run Rate (1 -> 2)">
        <template slot-scope="scope">
          <h3>
            {{ matchesDetail[scope.row.Match_Id] ? matchesDetail[scope.row.Match_Id].Net_Run_Rate ? matchesDetail[scope.row.Match_Id].Net_Run_Rate : 'Calc Failed due to insufficient data!' : 'Calc Failed due to insufficient data!' }}
          </h3>
        </template>
      </el-table-column>
      <el-table-column label="Team stats">
        <template slot-scope="scope">
          <p>{{ `Team_Name_${scope.row.Team_Name_Id}` }}</p>
          <h3>
            {{
            (matchesDetail[scope.row.Match_Id][1].teamId == scope.row.Team_Name_Id ?
              `${matchesDetail[scope.row.Match_Id][1].runs} / ${matchesDetail[scope.row.Match_Id][1].totalOuts} (${matchesDetail[scope.row.Match_Id][1].overs.length} o)`:
              `${matchesDetail[scope.row.Match_Id][2].runs} / ${matchesDetail[scope.row.Match_Id][2].totalOuts} (${matchesDetail[scope.row.Match_Id][2].overs.length} o)`)
            }}
          </h3>
          <p>{{ `Team_Name_${scope.row.Opponent_Team_Id}` }}</p>
          <h3>
            {{
            (matchesDetail[scope.row.Match_Id][1].teamId == scope.row.Opponent_Team_Id ?
              `${matchesDetail[scope.row.Match_Id][1].runs} / ${matchesDetail[scope.row.Match_Id][1].totalOuts} (${matchesDetail[scope.row.Match_Id][1].overs.length} o)`:
              `${matchesDetail[scope.row.Match_Id][2].runs} / ${matchesDetail[scope.row.Match_Id][2].totalOuts} (${matchesDetail[scope.row.Match_Id][2].overs.length} o)`)
            }}
          </h3>
        </template>
      </el-table-column>
    </el-table>
    </el-col>
    <el-col :span="3"></el-col>
  </el-row>
</template>

<script>
export default {
  name: "MatchesDetailTable",
  props: ["matches", "matchesDetail"],
  methods: {
    onMatchSelect(match) {
      this.$emit("matchSelect", { match });
    }
  }
};
</script>

<style>
.custom-row {
  cursor: pointer;
}
.custom-row:hover {
  -webkit-box-shadow: 5px 5px 84px -23px rgba(0,0,0,0.69);
  -moz-box-shadow: 5px 5px 84px -23px rgba(0,0,0,0.69);
  box-shadow: 5px 5px 84px -23px rgba(0,0,0,0.69);
}
tbody::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
}
tbody::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0,0,0,.5);
    box-shadow: 0 0 1px rgba(255,255,255,.5);
}
</style>

<style scoped>
.col {
  text-align: center;
  background: red;
}
.winner {
  color: green;
}
.loser {
  color: red;
}
</style>

<template>
  <el-card shadow="always" id="focusedElement">
    <h1>Match {{ match.Match_Id }}</h1>
    <p v-if="matchNum">This was {{ matchNum | NumberSuffix }} match of this season.</p>
    <p>{{ match.Match_Date | PlainDate }}</p>
    <p>Net Run Rate: ±{{ matchDetails.Net_Run_Rate }}</p>
    <Loading v-if="loading" />
    <div v-else>
      <div class="same-line">
        <h3 :class="match.Team_Name_Id == match.Match_Winner_Id  ? 'winner' : 'loser'">Team_Name_{{ match.Match_Winner_Id == match.Opponent_Team_Id ? match.Opponent_Team_Id : match.Team_Name_Id }}</h3>
        <span>
          {{
            (matchDetails[1].teamId == match.Team_Name_Id ?
                `${matchDetails[1].runs} / ${matchDetails[1].totalOuts} (${matchDetails[1].overs.length} o)`:
                `${matchDetails[2].runs} / ${matchDetails[2].totalOuts} (${matchDetails[2].overs.length} o)`)
          }}
        </span>
      </div>
      VS
      <div class="same-line">
        <h3 :class="match.Team_Name_Id == match.Match_Winner_Id  ? 'winner' : 'loser'">Team_Name_{{ match.Match_Winner_Id == match.Opponent_Team_Id ? match.Team_Name_Id : match.Opponent_Team_Id }}</h3>
        <span>
          {{
            (matchDetails[2].teamId == match.Team_Name_Id ?
                `${matchDetails[1].runs} / ${matchDetails[1].totalOuts} (${matchDetails[1].overs.length} o)`:
                `${matchDetails[2].runs} / ${matchDetails[2].totalOuts} (${matchDetails[2].overs.length} o)`)
          }}
        </span>
        <div class="chart">
        </div>
      </div>
      <p>{{ match.Win_Type != 'Tie' ? `Team_Name_${match.Match_Winner_Id} won by ${match.Won_By} ${match.Win_Type.slice(2,match.Win_Type.length)}` : match.Win_Type == 'Tie' ? 'No Winner - Tie Match' : 'No Result' }}</p>

      <el-row :gutter="6">
        <el-col :span="12">
          <el-card>
            <h3>Team_Name_{{ match.Match_Winner_Id }}</h3>
            <team-basic-stats
              :totalRuns="matchDetails[innOfWinner].runs"
              :extraRuns="matchDetails[innOfWinner].extraRuns"
              :totalOuts="matchDetails[innOfWinner].totalOuts"
              :runChart="TeamStatChart.runs[innOfWinner]"
              :outChart="TeamStatChart.outs[innOfWinner]"
            ></team-basic-stats>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <h3>Team_Name_{{ match.Match_Loser_Id }}</h3>
            <team-basic-stats
              :totalRuns="matchDetails[innOfLoser].runs"
              :extraRuns="matchDetails[innOfLoser].extraRuns"
              :totalOuts="matchDetails[innOfLoser].totalOuts"
              :runChart="TeamStatChart.runs[innOfLoser]"
              :outChart="TeamStatChart.outs[innOfLoser]"
            ></team-basic-stats>
            <!-- <h4>Total Sixes: {{ matchDetails[2].teamId == match.Team_Name_Id ? matchDetails[2].sixes : matchDetails[1].sixes }}</h4> -->
          </el-card>
        </el-col>
      </el-row>

      <br />
      <p>Runs per over of both teams:</p>

      <div class="chart">
        <bar-chart
          type="bar"
          :dataProp="RPOChart.data"
          :options="RPOChart.options"
          xStepSize="1"
        ></bar-chart>
      </div>

      <hr />
      <p>Run Rate per over of both teams:</p>

      <div class="chart">
        <chart
          type="line"
          :dataProp="RunsPerOverChart.data"
          :options="RunsPerOverChart.options"
          :showlines="true"
        ></chart>
      </div>

    </div>
  </el-card>
</template>

<script>
import localforage from "localforage";

import BarChart from "@/components/BarChart";
import Chart from "@/components/Chart";
import TeamBasicStats from "@/components/TeamBasicStats";
import Loading from "@/components/Loading";

import store from "../sharedservice";
import { getColor, getColors, getLightColors } from "../utils";

export default {
  name: "MatchOverview",
  components: {
    Loading,
    BarChart,
    Chart,
    TeamBasicStats
  },
  data() {
    return {
      match: {},
      matchDetails: {},
      matchNum: null,
      innOfWinner: null,
      innOfLoser: null,
      RPOChart: {
        options: {},
        legend: {
          display: false
        },
        data: {
          labels: [],
          datasets: []
        }
      },
      RunsPerOverChart: {
        options: {},
        data: {
          labels: [],
          datasets: []
        }
      },
      TeamStatChart: {
        outs: {
          1: {
            data: [],
            options: { legend: { display: false } }
          },
          2: {
            data: [],
            options: { legend: { display: false } }
          }
        },
        runs: {
          1: {
            data: [],
            options: { legend: { display: false } }
          },
          2: {
            data: [],
            options: { legend: { display: false } }
          }
        }
      },
      teamStats: [],
      loading: true
    };
  },
  async mounted() {
    this.match = this.$route.params.match || await localforage.getItem('match');
    this.matchDetails = this.$route.params.matchDetails || await localforage.getItem('matchDetails');
    this.matchNum = this.$route.params.matchNum || await localforage.getItem('matchNum');

    document.getElementById('focusedElement').scrollIntoView();

    this.match.Match_Loser_Id =
      this.match.Match_Winner_Id == this.match.Team_Name_Id
        ? this.match.Opponent_Team_Id
        : this.match.Team_Name_Id;

    let totalRunsYet_1 = 0, totalRunsYet_2 = 0;
    const runRatePerOver_1 = [], runRatePerOver_2 = [];
    const RPO_1 = [], RPO_2 = [];
    const overs = { "1": [], "2": [] };
    for (let j = "1"; j <= "2"; j++) {
      for (let i = 0; i < this.matchDetails[j].overs.length; i++) {
        const over = this.matchDetails[j].overs[i];
        if (this.matchDetails[j].teamId == this.match.Match_Winner_Id) {
          totalRunsYet_1 += over.runs;
          runRatePerOver_1.push((totalRunsYet_1 / (i + 1)).toFixed(2));
          RPO_1.push(over.runs);
        } else {
          totalRunsYet_2 += over.runs;
          runRatePerOver_2.push((totalRunsYet_2 / (i + 1)).toFixed(2));
          RPO_2.push(over.runs);
        }
        overs[j].push(`Over_${i + 1}`);
      }
    }

    this.RPOChart.data = {
      labels: overs["1"].length > overs["2"].length ? overs["1"] : overs["2"],
      datasets: [
        {
          data: RPO_1,
          label: `Runs Per Over (Team_Name_${this.match.Match_Winner_Id})`,
          borderWidth: 1,
          backgroundColor: getColor(5).color,
          borderColor: getColor(5).lightColor
        },
        {
          data: RPO_2,
          label: `Runs Per Over (Team_Name_${this.match.Match_Loser_Id})`,
          borderWidth: 1,
          backgroundColor: getColor(6).color,
          borderColor: getColor(6).lightColor
        }
      ]
    };

    this.RunsPerOverChart.data = {
      labels: overs["1"].length > overs["2"].length ? overs["1"] : overs["2"],
      datasets: [
        {
          data: runRatePerOver_1,
          label: `Run Rate Per Over (Team_Name_${this.match.Match_Winner_Id})`,
          borderColor: Array(runRatePerOver_1.length).fill(getColor(5).color),
          borderWidth: 2,
          fill: false
        },
        {
          data: runRatePerOver_2,
          label: `Run Rate Per Over (Team_Name_${this.match.Match_Loser_Id})`,
          borderColor: Array(runRatePerOver_2.length).fill(getColor(6).color),
          borderWidth: 2,
          fill: false
        }
      ]
    };

    this.innOfWinner = Number(
      this.match.Match_Winner_Id == this.matchDetails[1].teamId
    ) ? 1 : 2;

    this.innOfLoser = this.innOfWinner == 1 ? 2 : 1;

    [1, 2].forEach(i => {
      this.TeamStatChart.outs[i].data = {
        labels: ["Sixes", "Fours", "Wides", "Byes", "Leg Byes", "No-Balls"],
        datasets: [
          {
            backgroundColor: getColor(3).lightColor,
            borderColor: getColor(3).color,
            pointBackgroundColor: getColor(1).color,
            data: [
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].sixes,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].fours,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].wides,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].byes,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].legByes,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].noBalls
            ]
          }
        ]
      };
    });

    [1, 2].forEach(i => {
      this.TeamStatChart.runs[i].data = {
        labels: ["Run-outs", "Bowled", "Caught", "Stumped"],
        datasets: [
          {
            backgroundColor: getColor(3).lightColor,
            borderColor: getColor(3).color,
            pointBackgroundColor: getColor(1).color,
            data: [
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].runOuts,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].bowled,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].caught,
              this.matchDetails[i == 1 ? this.innOfWinner : this.innOfLoser].stumped
            ]
          }
        ]
      };
    });

    this.loading = false;
  }
};
</script>

<style scoped>
.same-line {
  margin: 10px;
}
.same-line h3 {
  display: inline;
}
.same-line span {
  float: none;
  margin-left: 8px;
}
#focusedElement {
  min-height: 1200px;
}
</style>
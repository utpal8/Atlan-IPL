<template>
  <el-card shadow="always" id="focusedEl">
    <Loading v-if="loading" />
    <div v-else>
      <h1>{{ venueMatches[0].Venue_Name }}</h1>
      <p>{{ venueMatches[0].City_Name + ', ' + venueMatches[0].Host_Country }}</p>
      <p>Season: <b>{{ venueMatches[0].Season_Id }}</b></p>
      <p>Total Matches: <b>{{ venueMatches ? venueMatches.length : 0 }}</b></p>
      <p>{{ `${venueMatches[0].Match_Date}|${venueMatches[venueMatches.length - 1].Match_Date}` | ToFromDate }}</p>

      <p>
        Highest Total Recorded:
        <b>{{ highestTotalRecorded.runs }}/{{ highestTotalRecorded.inning.totalOuts }}({{highestTotalRecorded.inning.overs.length}} o) by Team_Name_{{ highestTotalRecorded.match.Match_Winner_Id }}</b>
      </p>

      <p>
        Lowest Total Recorded:
        <b>
          {{
            lowestTotalRecorded.runs }}/{{ lowestTotalRecorded.inning.totalOuts }}
            ({{lowestTotalRecorded.inning.overs.length}} o) by Team_Name_{{ lowestTotalRecorded.match.Match_Winner_Id == lowestTotalRecorded.match.Team_Name_Id ? lowestTotalRecorded.match.Opponent_Team_Id : lowestTotalRecorded.match.Team_Name_Id
          }}
        </b>
      </p>

      <el-row>
        <el-col :span="12" :offset="6">
          <chart
            type="pie"
            :dataProp="matchesWonByChart.data"
            :options="matchesWonByChart.options"
          ></chart>
        </el-col>
      </el-row>

      <br />

      <el-row>
        <el-col :span="12">
          <p>Average First Inning Score: {{ avgFirstInningScore }}</p>
          <div class="chart">
            <bar-chart
              type="bar"
              :dataProp="avgInningScoreChart[1].data"
              :options="avgInningScoreChart[1].option"
            ></bar-chart>
          </div>
        </el-col>
        <el-col :span="12">
          <p>Average Second Inning Score: {{ avgSecondInningScore }}</p>
          <div class="chart">
            <bar-chart
              type="bar"
              :dataProp="avgInningScoreChart[2].data"
              :options="avgInningScoreChart[2].options"
            ></bar-chart>
          </div>
        </el-col>
      </el-row>

      <br />
      <hr />
      <h3>Match Results in the Venue (for this season):</h3>
      <matches-detail-table
        :matches="venueMatches"
        :matchesDetail="fullMatchesDetail"
        @matchSelect="navigateToMatchOverview"
      ></matches-detail-table>
    </div>
  </el-card>
</template>

<script>
import localforage from "localforage";

import MatchesDetailTable from "@/components/MatchesDetailTable";
import Chart from "@/components/Chart";
import BarChart from "@/components/BarChart";
import Loading from "@/components/Loading";

import { getColor } from '../utils';

export default {
  name: "VenueOverview",
  components: {
    Loading,
    Chart,
    BarChart,
    MatchesDetailTable
  },
  data() {
    return {
      venueMatches: [],
      matchesDetail: [],
      fullMatchesDetail: {},
      matchesWonType: {
        bat: 0,
        ball: 0
      },
      matchesWonByChart: {
        data: {},
        options: { responsive: true }
      },
      avgInningScoreChart: {
        1: { data: {}, options: { legends: { display: false } } },
        2: { data: {}, options: {} },
      },
      highestTotalRecorded: {
        runs: -1,
        match: null,
        inning: null
      },
      lowestTotalRecorded: {
        runs: 1000,
        match: null,
        inning: null
      },
      avgFirstInningScore: null,
      avgSecondInningScore: null,
      loading: true
    };
  },
  async mounted() {

    document.getElementById('focusedEl').scrollIntoView();

    this.venueMatches =
      this.$route.params.venueMatches ||
      (await localforage.getItem("venueMatches"));
    this.matchesDetail =
      this.$route.params.matchesDetail ||
      (await localforage.getItem("venueMatchesDetail"));
    this.fullMatchesDetail =
        this.$route.params.fullMatchesDetail ||
      (await localforage.getItem("fullMatchesDetail"));

    this.venueMatches.forEach(match => {
      const matchDetail = this.fullMatchesDetail[match.Match_Id];
      if (match.Toss_Winner_Id == match.Match_Winner_Id) {
        this.matchesWonType[match.Toss_Decision == "bat" ? "bat" : "ball"]++;
      } else {
        this.matchesWonType[match.Toss_Decision == "bat" ? "ball" : "bat"]++;
      }

      // calculate highestTotalRecorded
      if (matchDetail[1].runs > this.highestTotalRecorded.runs) {
        this.highestTotalRecorded.runs = matchDetail[1].runs;
        this.highestTotalRecorded.match = match;
        this.highestTotalRecorded.inning = matchDetail[1];
      }
      if (matchDetail[2].runs > this.highestTotalRecorded.runs) {
        this.highestTotalRecorded.runs = matchDetail[2].runs;
        this.highestTotalRecorded.match = match;
        this.highestTotalRecorded.inning = matchDetail[2];
      }

      if (matchDetail[1].runs < this.lowestTotalRecorded.runs) {
        this.lowestTotalRecorded.runs = matchDetail[1].runs;
        this.lowestTotalRecorded.match = match;
        this.lowestTotalRecorded.inning = matchDetail[1];
      }
      if (matchDetail[2].runs < this.lowestTotalRecorded.runs) {
        this.lowestTotalRecorded.runs = matchDetail[2].runs;
        this.lowestTotalRecorded.match = match;
        this.lowestTotalRecorded.inning = matchDetail[2];
      }

    });

    this.matchesWonByChart.data = {
      labels: ["Matches won - Batting first ", "Matches won - Bowling first"],
      datasets: [
        {
          fill: true,
          backgroundColor: [getColor(5).color, getColor(6).color],
          data: [this.matchesWonType['bat'], this.matchesWonType['ball']],
          borderColor: [getColor(5).lightColor, getColor(6).lightColor],
          borderWidth: [2, 2]
        },
      ]
    };

    let firstInnScore = [], secondInnScore = [];
    this.matchesDetail.forEach(m => {
      firstInnScore.push(m[1].runs);
      secondInnScore.push(m[2].runs);
    });

    [1, 2].forEach(i => {
      this.avgInningScoreChart[i].data = {
        labels: this.matchesDetail.map((m, i) => `match_${i + 1}`),
        datasets: [
          {
            label: `${i == 1 ? 'First' : 'Second'} Inning Scores`,
            borderWidth: 1,
            backgroundColor: getColor(3).color,
            borderColor: getColor(3).lightColor,
            data: i == 1 ? firstInnScore : secondInnScore
          }
        ]
      };
    });

    this.avgFirstInningScore = (firstInnScore.reduce((s, a) => s + a, 0) / firstInnScore.length).toFixed(2);
    this.avgSecondInningScore = (secondInnScore.reduce((s, a) => s + a, 0) / secondInnScore.length).toFixed(2);

    this.loading = false;
  },
  methods: {
    async navigateToMatchOverview({ match }) {

      await localforage.setItem('match', match);
      await localforage.setItem('matchDetails', this.fullMatchesDetail[match.Match_Id]);
      await localforage.removeItem('matchNum');

      this.$router.push({
        name: "match-overview",
        params: {
          match,
          matchDetails: this.fullMatchesDetail[match.Match_Id]
        }
      });
    },
  }
};
</script>

<style scoped>
.el-card {
  min-height: 1200px;
}
</style>
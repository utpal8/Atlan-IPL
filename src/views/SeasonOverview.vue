<template>
  <el-card shadow="always" id="focusedElem">
    <h1>Season {{ id }}</h1>
    <p>{{ `${season.startDate}|${season.endDate}` | ToFromDate }}</p>
    <p>Total Matches: <b>{{ season.matches ? season.matches.length : '' }}</b></p>
    <Loading v-if="loading" />
    <div v-else>
      <p>Total Teams Participated: <b>{{ dataByTeams.length }}</b></p>
      <p>No. of Matches won per team:</p>
      <el-row justify="center">
        <el-col :span="16" :offset="4">
          <div class="chart">
            <bar-chart
              type="horizontalBar"
              :dataProp="teamsByWinsChart.data"
              :options="teamsByWinsChart.options"
              xStepSize="1"
            ></bar-chart>
          </div>
          <p>Season's Net Run Rate:</p>
          <div class="chart">
            <bar-chart
              type="bar"
              :dataProp="teamsNRRChart.data"
              :options="teamsNRRChart.options"
              xStepSize="1"
            ></bar-chart>
          </div>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>

      <hr />
      <h3>Venues / Stadiums in the Season</h3>
      <venue-select :dataByVenues="dataByVenues" @venueClick="onVenueSelect"></venue-select>

      <hr />
      <h3>Match Results of the Season</h3>
      <matches-detail-table
        :matches="season.matches"
        :matchesDetail="matchesDetail"
        @matchSelect="navigateToMatchOverview"
      ></matches-detail-table>
    </div>
  </el-card>
</template>

<script>
import localforage from "localforage";

import BarChart from "@/components/BarChart";
import VenueSelect from "@/components/VenueSelect";
import MatchesDetailTable from "@/components/MatchesDetailTable";
import Loading from "@/components/Loading";

import store from "../sharedservice";
import { getColor, getColors, getLightColors } from "../utils";

export default {
  name: "SeasonOverview",
  components: {
    Loading,
    BarChart,
    VenueSelect,
    MatchesDetailTable
  },
  data() {
    return {
      id: null,
      season: [],
      dataByTeams: [],
      dataByVenues: [],
      teamsByWinsChart: {
        options: {
          legend: {
            display: false
          }
        },
        data: {
          labels: [],
          datasets: []
        }
      },
      teamsNRRChart: {
        options: {
          legend: {
            display: false
          }
        },
        data: {
          labels: [],
          datasets: []
        }
      },
      matchesDetail: {},
      loading: true
    };
  },
  async mounted() {
    this.id = this.$route.params.id || await localforage.getItem('seasonId');
    this.season = this.$route.params.season || await localforage.getItem('season');

    // I know element can be accessed via this.$refs if defined a ref prop.
    document.getElementById("focusedElem").scrollIntoView();

    const worker = store.getItem('worker');

    const dataByTeams = await worker.postMessage("getDataByTeams", [
      this.season.matches
    ]);

    const ballByBallJSON = await localforage.getItem("BallbyBall_JSON");
    const matchesDetail = await worker.postMessage("getMatchDetails", [
      ballByBallJSON
    ]);
    this.matchesDetail = matchesDetail;

    // prepare data for num match wins
    const teamNames = [];
    const winningMatches = [];
    const losingMatches = [];
    const NRRs = [];
    const teamKeys = Object.keys(dataByTeams);
    teamKeys.forEach(key => {
      const matches = dataByTeams[key];
      let wonMatches = 0;
      let lostMatches = 0;
      let NRRInSeason = 0;
      let consideredMatches = 0;
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].Match_Winner_Id == key) {
          wonMatches++;
        } else {
          lostMatches++;
        }

        /**
         * Due to insufficient ball by ball data of few matches (501230, 501250, etc),
         * we are skipping the matches, we couldn't calculate NRR of.
         * These matches doesn't contain information of full second inning (all players are not dismissed)
         */
        const matchDetail = this.matchesDetail[matches[i].Match_Id];

        if (matchDetail.Net_Run_Rate) {
          NRRInSeason += Number(matchDetail.Net_Run_Rate);
          consideredMatches++;
        }
      }

      NRRInSeason /= consideredMatches;

      teamNames.push(`Team_Name_${key}`);
      winningMatches.push(wonMatches);
      losingMatches.push(lostMatches);
      NRRs.push(NRRInSeason.toFixed(2));
      this.dataByTeams.push(dataByTeams[key]);
    });

    // update num of match wins chart
    this.teamsByWinsChart.data = {
      labels: teamNames,
      datasets: [
        {
          data: winningMatches,
          label: "No of wins",
          borderWidth: 1,
          backgroundColor: Array(winningMatches.length).fill(getColor(2).color),
          borderColor: Array(winningMatches.length).fill(getColor(2).lightColor)
        },
        {
          data: losingMatches,
          label: "No of loses",
          borderWidth: 1,
          backgroundColor: Array(losingMatches.length).fill(getColor(1).color),
          borderColor: Array(losingMatches.length).fill(getColor(1).lightColor)
        }
      ]
    };

    this.teamsNRRChart.data = {
      labels: teamNames,
      datasets: [
        {
          data: NRRs,
          label: "Net Run Rate of team",
          borderWidth: 1,
          backgroundColor: Array(NRRs.length).fill(getColor(6).color),
          borderColor: Array(NRRs.length).fill(getColor(6).lightColor)
        }
      ]
    };

    // TO GET DATA BY VENUES
    const dataByVenues = await worker.postMessage("getDataByVenues", [
      this.season.matches
    ]);
    const venueKeys = Object.keys(dataByVenues);
    venueKeys.forEach(key => {
      this.dataByVenues.push(dataByVenues[key]);
    });

    this.loading = false;
  },
  methods: {
    async navigateToMatchOverview({ match }) {
      const matchNum = this.season.matches.findIndex(m => m.Match_Id == match.Match_Id) || 0 + 1;

      await localforage.setItem('match', match);
      await localforage.setItem('matchDetails', this.matchesDetail[match.Match_Id]);
      await localforage.setItem('matchNum', matchNum);

      this.$router.push({
        name: "match-overview",
        params: {
          match,
          matchDetails: this.matchesDetail[match.Match_Id],
          matchNum
        }
      });
    },
    async onVenueSelect(venueMatches) {
      const matchesDetail = venueMatches.map(m => this.matchesDetail[m.Match_Id]);

      await localforage.setItem('venueMatches', venueMatches);
      await localforage.setItem('venueMatchesDetail', matchesDetail);
      await localforage.setItem('fullMatchesDetail', this.matchesDetail);

      this.$router.push({
        name: "venue-overview",
        params: {
          venueMatches,
          matchesDetail,
          fullMatchesDetail: this.matchesDetail
        }
      });
    }
  }
};
</script>

<style scoped>
.el-card {
  min-height: 1200px;
}
</style>
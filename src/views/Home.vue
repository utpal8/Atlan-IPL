<template>
  <div>
    <p v-if="fetchingData">Fetching Data from server...</p>
    <Loading v-else-if="dataLoading" />
    <SeasonSelect v-else :dataBySeasons="dataBySeasons" @seasonClick="seasonSelected" />
  </div>
</template>

<script>
import localforage from "localforage";

import SeasonSelect from "@/components/SeasonSelect.vue";
import Loading from "@/components/Loading.vue";

import store from "../sharedservice";

export default {
  name: "home",
  components: {
    SeasonSelect,
    Loading
  },
  data() {
    return {
      matchesData: null,
      worker: null,
      dataBySeasons: null,
      dataLoading: true,
      Match: null,
      Ball_by_Ball: null,
      fetchingData: true
    };
  },
  async created() {
    this.worker = store.getItem('worker');
    localforage.setDriver(localforage.INDEXEDDB);

    // Eagerly loading CSV files for better experience later

    this.Match = await localforage.getItem('Match_Data')
    this.Ball_by_Ball = await localforage.getItem('Ball_by_Ball_Data')

    if (!this.Match) {
      await fetch('https://file-provider.herokuapp.com/Match.csv')
        .then(res => res.text())
        .then(res => {
          console.log('Match.csv received from server!')
          this.Match = res;
        });
    }
    
    if (!this.Ball_by_Ball) {
      await fetch('https://file-provider.herokuapp.com/Ball_by_Ball.csv')
        .then(res => res.text())
        .then(res => {
          console.log('Ball_by_Ball.csv received from server!')
          this.Ball_by_Ball = res;
        });
    }

    this.fetchingData = false;

    localforage.setItem('Match_Data', this.Match)
    localforage.setItem('Ball_by_Ball_Data', this.Ball_by_Ball)

    const Matches_JSON = await localforage.getItem("Matches_JSON");
    if (Matches_JSON) {
      Promise.resolve(Matches_JSON).then(this.MatchJSONReady);
    } else {
      this.worker
        .postMessage("convertToJSON", [this.Match])
        .then(this.MatchJSONReady);
    }
  },
  methods: {
    async seasonSelected(seasonKey) {
      await localforage.setItem('seasonId', seasonKey);
      await localforage.setItem('season', this.dataBySeasons[seasonKey]);
      this.$router.push({
        name: "season-overview",
        params: { season: this.dataBySeasons[seasonKey], id: seasonKey }
      });
    },

    /**
     * Callback functions for data loading events
     */
    MatchJSONReady(matchesJSON) {
      localforage.setItem("Matches_JSON", matchesJSON);

      this.matchesData = matchesJSON;

      localforage.getItem("Matches_By_Seasons").then(Matches_By_Seasons => {
        if (Matches_By_Seasons) {
          Promise.resolve(Matches_By_Seasons).then(this.MatchesBySeasonsReady);
        } else {
          this.worker
            .postMessage("getDataBySeasons", [this.matchesData])
            .then(this.MatchesBySeasonsReady);
        }
      });
    },
    MatchesBySeasonsReady(matchesBySeasons) {
      localforage.setItem("Matches_By_Seasons", matchesBySeasons);
      this.dataBySeasons = matchesBySeasons;

      // Load ball data here for later use
      localforage.getItem("BallByBall_JSON").then(BallbyBallJSON => {
        if (BallbyBallJSON) {
          Promise.resolve(BallbyBallJSON).then(this.BallByBallJSONReady);
        } else {
          this.worker
            .postMessage("convertToJSON", [this.Ball_by_Ball])
            .then(this.BallByBallJSONReady);
        }
      });
    },
    BallByBallJSONReady(ballByBallJSON) {
      localforage.setItem("BallbyBall_JSON", ballByBallJSON);
      this.dataLoading = false;
    }
  }
};
</script>
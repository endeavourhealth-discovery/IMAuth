<template>
  <div class="p-d-flex p-flex-row p-jc-start">
    <Button class="back-button" label="Back" icon="pi pi-arrow-circle-left" iconPos="left" v-on:click.prevent="clickedBack" />
    <Button class="home-button" icon="pi pi-home" v-on:click.prevent="homeClicked" />
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ButtonBar",
  computed: mapState(["snomedLicenseAccepted", "previousAppUrl"]),
  methods: {
    clickedBack(): void {
      this.$router.back();
    },

    homeClicked(): void {
      window.location.href = "http://endhealth.info";
    }
  }
});
</script>

<style scoped>
.back-button {
  width: fit-content;
}

.home-button {
  margin-left: 0.25em;
}
</style>

<template>
  <div class="flex flex-row justify-content-start">
    <Button
      data-testid="button-bar-back-button"
      class="back-button"
      label="Back"
      icon="pi pi-arrow-circle-left"
      iconPos="left"
      v-on:click.prevent="clickedBack"
    />
    <Button data-testid="button-bar-home-button" class="home-button" icon="pi pi-home" v-on:click.prevent="homeClicked" />
  </div>
</template>

<script setup lang="ts">
import { mapState, useStore } from "vuex";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Services } from "im-library";

const store = useStore();
const router = useRouter();

const previousAppUrl = computed(() => store.state.previousAppUrl);

function clickedBack(): void {
  router.back();
}

function homeClicked(): void {
  window.location.href = previousAppUrl.value ? previousAppUrl.value : Services.Env.DIRECTORY_URL;
}
</script>

<style scoped>
.back-button {
  width: fit-content;
}

.home-button {
  margin-left: 0.25em;
}
</style>

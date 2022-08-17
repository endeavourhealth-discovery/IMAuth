<template>
  <div class="flex flex-row justify-content-start">
    <Button class="back-button" label="Back" icon="pi pi-arrow-circle-left" iconPos="left" v-on:click.prevent="clickedBack" />
    <Button class="home-button" icon="pi pi-home" v-on:click.prevent="homeClicked" />
  </div>
</template>

<script setup lang="ts">
import { mapState, useStore } from "vuex";
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Services } from "im-library";
const { Env } = Services;

const store = useStore();
const router = useRouter();

const previousAppUrl = computed(() => store.state.previousAppUrl);

function clickedBack(): void {
  router.back();
}

function homeClicked(): void {
  window.location.href = previousAppUrl.value ? previousAppUrl.value : Env.DIRECTORY_URL;
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

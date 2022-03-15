<template>
  <div class="flex flex-column align-items-center justify-content-start user-container">
    <div class="flex flex-column justify-content-start card-button-container">
      <ButtonBar />
      <div id="user-card-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ButtonBar from "@/components/user/ButtonBar.vue";

export default defineComponent({
  name: "User",
  components: {
    ButtonBar: ButtonBar
  }
});
</script>

<style scoped>
.user-container {
  width: 100%;
  height: 95vh;
  /* overflow-y: auto; */
  margin-top: 5vh;
}

.card-button-container {
  height: 100%;
}

#user-card-container {
  height: 100%;
  overflow-y: auto;
}
</style>

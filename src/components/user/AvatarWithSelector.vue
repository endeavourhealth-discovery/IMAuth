<template>
  <div class="avatar-container">
    <img data-testid="avatar-image" id="selected-avatar" :src="getUrl(newAvatar)" alt="avatar icon" />
    <Button data-testid="avatar-op-button" icon="pi pi-angle-down" class="p-button-rounded p-button-primary avatar-button" @click="toggleAvatarSelect" />
    <OverlayPanel ref="avatar" class="avatar-popup">
      <div>
        Icons made by
        <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a>
        from
        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
      </div>
      <SelectButton data-testid="avatar-button-options"  v-model="newAvatar" :options="avatarOptions">
        <template #option="slotProps">
          <img class="avatar-select avatar-icon" :src="getUrl(slotProps.option)" alt="avatar icon" />
        </template>
      </SelectButton>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import { Constants } from "im-library";
import { Ref, ref, watch } from "vue";
const { Avatars } = Constants;

const props = defineProps({
  selectedAvatar: { type: String, required: true }
});

const emit = defineEmits({
  avatarSelected: (payload: string) => Constants.Avatars.includes(payload)
});

const avatar = ref();

watch(
  () => props.selectedAvatar,
  newValue => {
    newAvatar.value = newValue;
  }
);

let avatarOptions: Ref<string[]> = ref([...Avatars]);
let newAvatar = ref(props.selectedAvatar);

watch(newAvatar, newValue => {
  emit("avatarSelected", newValue);
});

function toggleAvatarSelect(event: any): void {
  const x = avatar.value as any;
  x.toggle(event);
}

function getUrl(item: string): string {
  const url = new URL(`../../assets/avatars/${item}`, import.meta.url);
  return url.href;
}
</script>

<style scoped>
.avatar-container {
  position: relative;
  padding: 1.5em;
  /* margin: 1em; */
}

.avatar-button {
  position: absolute;
  bottom: 0;
  right: 0;
}

#selected-avatar {
  width: 10rem;
  border: 1px solid lightgray;
  border-radius: 50%;
}

.avatar-icon {
  width: 3em;
}
</style>

<style>
.avatar-popup {
  width: 25em;
  height: 40vh;
  overflow-y: auto;
}

.avatar-popup div div .p-button {
  margin: 2px;
  border-right: 1px solid #ced4da !important;
}
</style>

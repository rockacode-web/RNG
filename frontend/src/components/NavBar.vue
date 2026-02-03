<template>
  <VToolbar flat density="compact" color="surface" height="100">
    <VContainer fluid>
      <VRow align="center" justify="center">
        <VCol cols="1" align="left"></VCol>

        <VCol cols="10" align="center">
          <RouterLink class="route" :to="{ name: 'Home' }">
            <VBtn
              class="text-subtitle-2"
              density="compact"
              color="primary"
              :variant="(route.name == 'Home') ? 'tonal' : 'text'"
            >
              Home
            </VBtn>
          </RouterLink>

          <!-- ✅ Lab 1 Appendix F: Add Game link properly (Vuetify button like Home) -->
          <RouterLink class="route" :to="{ name: 'Game' }">
            <VBtn
              class="text-subtitle-2"
              density="compact"
              color="primary"
              :variant="(route.name == 'Game') ? 'tonal' : 'text'"
            >
              Game
            </VBtn>
          </RouterLink>
        </VCol>

        <VCol cols="1" align="right">
          <VBtn size="x-small" :elevation="0" icon @click="darkmode = !darkmode">
            <VIcon v-if="darkmode" icon="mdi:mdi-weather-night"></VIcon>
            <VIcon v-else icon="mdi:mdi-white-balance-sunny"></VIcon>
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VToolbar>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { ref, watch, onMounted, onBeforeMount } from "vue";

const theme = useTheme();
const darkmode = ref(false);
const router = useRouter();
const route = useRoute();

watch(darkmode, (mode) => {
  theme.global.name.value = mode ? "darkMode" : "lightMode";
  localStorage.setItem("theme", mode ? "darkMode" : "lightMode");
});

onMounted(() => {});

onBeforeMount(() => {
  if (localStorage.getItem("theme") != null) {
    theme.global.name.value = localStorage.getItem("theme");
    darkmode.value = theme.global.current.value.dark;
  } else {
    localStorage.setItem(
      "theme",
      theme.global.current.value.dark ? "darkMode" : "lightMode"
    );
    darkmode.value = theme.global.current.value.dark;
  }
});
</script>

<style>
.route {
  text-decoration: none;
  margin-left: 8px;
  margin-right: 8px;
}
</style>

  
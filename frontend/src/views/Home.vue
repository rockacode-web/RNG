<template>
  <VContainer class="fill-height">
    <VResponsive class="align-center text-center fill-height">
      <VImg height="350" class="mb-5" src="@/assets/logo.svg" />

      <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

      <h1 class="text-h2 font-weight-bold">Elet2415</h1>
      <div class="text-body-1 font-weight-light mt-1">Practices in Electronics II</div>

      <div class="py-6" />

      <!-- Lab 1 / Appendix: show MQTT status + latest payload -->
      <VCard class="mx-auto" max-width="700" variant="tonal">
        <VCardText>
          <div class="text-h6 mb-2">MQTT Status</div>

          <div class="mb-2">
            Broker: <b>{{ host }}</b> &nbsp; | &nbsp; WS Port: <b>{{ port }}</b>
          </div>

          <div class="mb-2">
            Subscribed Topics:
            <span v-if="subscribedList.length === 0"> none</span>
            <span v-else>
              <b v-for="t in subscribedList" :key="t" style="margin-right:8px;">{{ t }}</b>
            </span>
          </div>

          <div class="mb-2">
            Latest Topic: <b>{{ payloadTopic }}</b>
          </div>

          <pre style="text-align:left; white-space:pre-wrap;">{{ prettyPayload }}</pre>

          <div class="mt-4">
            <VBtn color="primary" variant="flat" @click="connectAndSubscribe">
              Connect + Subscribe
            </VBtn>

            <VBtn class="ml-2" color="secondary" variant="tonal" @click="unsubscribeAll">
              Unsubscribe All
            </VBtn>
          </div>
        </VCardText>
      </VCard>

      <div class="py-6" />

      <VRow class="d-flex align-center justify-center">
        <VCol cols="auto">
          <VBtn
            href="https://vuetifyjs.com/components/all/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <VIcon icon="mdi-view-dashboard" size="large" start />
            Components
          </VBtn>
        </VCol>

        <VCol cols="auto">
          <VBtn
            color="primary"
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >
            <VIcon icon="mdi-speedometer" size="large" start />
            Get Started
          </VBtn>
        </VCol>

        <VCol cols="auto">
          <VBtn
            href="https://community.vuetifyjs.com/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <VIcon icon="mdi-account-group" size="large" start />
            Community
          </VBtn>
        </VCol>
      </VRow>
    </VResponsive>
  </VContainer>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useMqttStore } from "@/store/mqttStore";

const Mqtt = useMqttStore();

const host = computed(() => Mqtt.host);
const port = computed(() => Mqtt.port);

const payloadTopic = computed(() => Mqtt.payloadTopic || "");
const prettyPayload = computed(() => JSON.stringify(Mqtt.payload, null, 2));

const subscribedList = computed(() => Object.keys(Mqtt.$state.subTopics || {}));

function connectAndSubscribe() {
  // Appendix: connect then subscribe to required topics
  Mqtt.connect();

  // Lab topics (same ones you used earlier)
  Mqtt.subscribe("620171712");     // data updates (hardware/backend pipeline)
  Mqtt.subscribe("620171712_sub"); // toggle/control channel
  Mqtt.subscribe("/elet2415");     // lab shared topic (if used in your appendix)
}

function unsubscribeAll() {
  Mqtt.unsubcribeAll();
}

onMounted(() => {
  connectAndSubscribe();
});

onBeforeUnmount(() => {
  unsubscribeAll();
});
</script>

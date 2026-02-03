<template>
  <div style="padding: 16px">
    <h2>Game</h2>

    <div style="margin: 12px 0;">
      <button @click="refreshAll">Refresh</button>
      <button style="margin-left:8px" @click="connectMqtt">Connect MQTT</button>
      <span v-if="error" style="color:red; margin-left:10px;">{{ error }}</span>
    </div>

    <h3>Number Frequency</h3>
    <pre>{{ numberFrequency }}</pre>

    <h3>LED Counts</h3>
    <div>LED A ON Count: <b>{{ ledA }}</b></div>
    <div>LED B ON Count: <b>{{ ledB }}</b></div>

    <h3>Send Toggle (Publishes to MQTT sub topic)</h3>
    <button @click="sendToggle('LED A')">Toggle LED A</button>
    <button style="margin-left:8px" @click="sendToggle('LED B')">Toggle LED B</button>

    <h3>Latest MQTT Payload (Appendix G)</h3>
    <div>Topic: <b>{{ payloadTopic }}</b></div>
    <pre>{{ payload }}</pre>
  </div>
</template>

<script>
import { useMqttStore } from "@/store/mqttStore";

export default {
  data() {
    return {
      numberFrequency: [],
      ledA: 0,
      ledB: 0,
      error: ""
    };
  },
  computed: {
    payload() {
      const Mqtt = useMqttStore();
      return JSON.stringify(Mqtt.payload, null, 2);
    },
    payloadTopic() {
      const Mqtt = useMqttStore();
      return Mqtt.payloadTopic || "";
    }
  },
  methods: {
    connectMqtt() {
      const Mqtt = useMqttStore();
      Mqtt.connect();

      // Lab topics
      Mqtt.subscribe("620171712", 0);      // hardware publishes here
      Mqtt.subscribe("/elet2415", 0);      // lab shared topic (if used)
    },

    async refreshAll() {
      this.error = "";
      try {
        // NOTE: you are calling frontend port 8080. If your backend differs, change base URL only.
        const nf = await fetch("http://localhost:8080/api/numberfrequency");
        const nfJson = await nf.json();
        this.numberFrequency = nfJson.data || nfJson || [];

        // ✅ use “LED A / LED B” naming like the lab uses
        const a = await fetch("http://localhost:8080/api/oncount/LED%20A");
        const aJson = await a.json();
        this.ledA = aJson.data ?? aJson.count ?? aJson ?? 0;

        const b = await fetch("http://localhost:8080/api/oncount/LED%20B");
        const bJson = await bJsonify(b);
        this.ledB = bJson.data ?? bJson.count ?? bJson ?? 0;

      } catch (e) {
        this.error = "API fetch failed. Is backend running and routes correct?";
      }
    },

    sendToggle(deviceName) {
      this.error = "";
      try {
        const Mqtt = useMqttStore();

        // ✅ Appendix: publish directly to sub-topic listened by backend/hardware bridge
        const message = JSON.stringify({ type: "toggle", device: deviceName });

        // This must match what your backend/hardware subscribes to (you used 620171712_sub earlier)
        Mqtt.publish("620171712_sub", message);

      } catch (e) {
        this.error = "MQTT publish failed (check broker WS port and connection).";
      }
    }
  },
  mounted() {
    this.connectMqtt();
    this.refreshAll();
  },
  beforeUnmount() {
    const Mqtt = useMqttStore();
    Mqtt.unsubcribeAll();
  }
};

// helper for cleaner parsing
async function bJsonify(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}
</script>

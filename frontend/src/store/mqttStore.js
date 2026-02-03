import { defineStore } from "pinia";
import { ref } from "vue";

export const useMqttStore = defineStore(
  "mqtt",
  () => {
    // STATES
    const mqtt = ref(null);

    // ✅ Lab broker (teacher said use yanacreations)
    const host = ref("www.yanacreations.com");

    // ✅ Websocket MQTT port (must be WS-enabled broker port)
    // If your lab handout says a different WS port, change this number only.
    const port = ref(9001);

    // ✅ initial payload schema
    const payload = ref({
      id: 620012345,
      timestamp: 1702566538,
      number: 0,
      ledA: 0,
      ledB: 0,
    });

    const payloadTopic = ref("");
    const subTopics = ref({});

    // ACTIONS
    const onSuccess = () => {};

    const onConnected = (reconnect, URI) => {
      console.log(`Connected to: ${URI} , Reconnect: ${reconnect}`);
      if (reconnect) {
        const topics = Object.keys(subTopics.value);
        if (topics.length > 0) {
          topics.forEach((topic) => subscribe(topic));
        }
      }
    };

    const onConnectionLost = (response) => {
      if (response.errorCode !== 0) {
        console.log(`MQTT: Connection lost - ${response.errorMessage}`);
      }
    };

    const onFailure = (response) => {
      const hostName = response.invocationContext.host;
      console.log(
        `MQTT: Connection to ${hostName} failed. \nError message : ${response.errorMessage}`
      );
    };

    const onMessageArrived = (response) => {
      try {
        payload.value = JSON.parse(response.payloadString);
        payloadTopic.value = response.destinationName;
        console.log(
          `Topic : ${payloadTopic.value} \nPayload : ${response.payloadString}`
        );
      } catch (error) {
        console.log(`onMessageArrived Error: ${error}`);
      }
    };

    const makeid = (length) => {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;

      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return "IOT_F_" + result;
    };

    // SUBSCRIBE UTILS
    const sub_onSuccess = (response) => {
      const topic = response.invocationContext.topic;
      console.log(`MQTT: Subscribed to - ${topic}`);
      subTopics.value[topic] = "subscribed";
    };

    const sub_onFailure = (response) => {
      const topic = response.invocationContext.topic;
      console.log(
        `MQTT: Failed to subscribe to - ${topic} \nError message : ${response.errorMessage}`
      );
    };

    const subscribe = (topic) => {
      try {
        var subscribeOptions = {
          onSuccess: sub_onSuccess,
          onFailure: sub_onFailure,
          invocationContext: { topic: topic },
        };
        mqtt.value.subscribe(topic, subscribeOptions);
      } catch (error) {
        console.log(`MQTT: Unable to Subscribe ${error}`);
      }
    };

    // UNSUBSCRIBE UTILS
    const unSub_onSuccess = (response) => {
      const topic = response.invocationContext.topic;
      console.log(`MQTT: Unsubscribed from - ${topic}`);
      delete subTopics.value[topic];
    };

    const unSub_onFailure = (response) => {
      const topic = response.invocationContext.topic;
      console.log(
        `MQTT: Failed to unsubscribe from - ${topic} \nError message : ${response.errorMessage}`
      );
    };

    const unsubcribe = (topic) => {
      var unsubscribeOptions = {
        onSuccess: unSub_onSuccess,
        onFailure: unSub_onFailure,
        invocationContext: { topic: topic },
      };
      mqtt.value.unsubscribe(topic, unsubscribeOptions);
    };

    const unsubcribeAll = () => {
      const topics = Object.keys(subTopics.value);
      if (topics.length > 0) {
        topics.forEach((topic) => {
          var unsubscribeOptions = {
            onSuccess: unSub_onSuccess,
            onFailure: unSub_onFailure,
            invocationContext: { topic: topic },
          };
          mqtt.value.unsubscribe(topic, unsubscribeOptions);
        });
      }
      disconnect();
    };

    // PUBLISH
    const publish = (topic, payloadString) => {
      const message = new Paho.MQTT.Message(payloadString);
      message.destinationName = topic;
      mqtt.value.publish(message);
    };

    // DISCONNECT
    const disconnect = () => {
      try {
        mqtt.value.disconnect();
      } catch (e) {}
    };

    // CONNECT
    const connect = () => {
      var IDstring = makeid(12);

      console.log(`MQTT: Connecting to Server : ${host.value} Port : ${port.value}`);

      mqtt.value = new Paho.MQTT.Client(host.value, port.value, "/mqtt", IDstring);

      var options = {
        timeout: 3,
        onSuccess: onSuccess,
        onFailure: onFailure,
        invocationContext: { host: host.value, port: port.value },
        useSSL: false,
        reconnect: true,
        uris: [`ws://${host.value}:${port.value}/mqtt`],
      };

      mqtt.value.onConnectionLost = onConnectionLost;
      mqtt.value.onMessageArrived = onMessageArrived;
      mqtt.value.onConnected = onConnected;

      mqtt.value.connect(options);
    };

    return {
      host,
      port,
      payload,
      payloadTopic,
      subscribe,
      unsubcribe,
      unsubcribeAll,
      publish,
      connect,
      disconnect,
    };
  },
  { persist: true }
);

 
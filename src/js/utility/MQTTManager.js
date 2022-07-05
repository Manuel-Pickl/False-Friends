/**
 * Handles the MQTT logic like connection and subscription
 */
 class MQTTManager {
    /*
        source: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
        test broker: http://www.hivemq.com/demos/websocket-client/;
    */
    host;
    port;
    subTopic;
    pubTopic;
    mqtt;
    brokerLog;
    subscribed;
    message;
    connected;
    
    /**
     * Creates and initializes an MQTTManager.
     */
    constructor() {
        this.brokerLog = document.querySelector(".modal .settings .broker-log");
        this.subTopic = "sensor/data";
        this.pubTopic = "sensehat/message";
        this.subscribed = false;
        this.connected = false;
        this.message = "0,0";
    }

    /**
     * Connects to the broker at the given ip address.
     * @param {string} ip The ip of the broker consisting of host and port
     */
    connect(ip) {
        let ipArray = ip.split(":");
        if (ipArray.length != 2) {
            this.brokerLog.textContent = "invalid ip";
            return;
        }

        this.host = ipArray[0];
        this.port = parseInt(ipArray[1]);

        // initialize broker connection
        this.mqtt = new Paho.MQTT.Client(this.host, this.port, "");
        this.mqtt.onMessageArrived = this.onMessageArrived.bind(this);

        var options = {
            timeout: 3,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onFailure.bind(this)
        };
        this.mqtt.connect(options);
        this.connected = true;
    }
    
    /**
     * Triggers a console log on connection success to the broker
     */
    onConnect() {
        this.brokerLog.textContent = `Connected to broker at: ${this.host}:${this.port}`;
    }
    
    /**
     * Triggers a console log on connection failure to the broker
     */
    onFailure() {
        this.brokerLog.textContent = `No broker at: ${this.host}:${this.port}`;
    }
    
    /**
     * Subscribe to the broker
     */
    subscribe() {
        this.mqtt.subscribe(this.subTopic);
        this.subscribed = true;
    }

    /**
     * Unsubscribe from the broker
     */
    unsubscribe() {
        this.mqtt.unsubscribe(this.subTopic);
        this.subscribed = false;
    }

    /**
     * Triggers when the broker publishes a message and saves it
     * @param {*} message The published message from the broker
     */
    onMessageArrived(message) {
        if (debug) {
            console.log(`recieved on topic "${message.destinationName}": "${message.payloadString}"`);
        }

        this.message = message.payloadString;
    }

    /**
     * Publish a message to the broker.
     * @param {string} message The message that gets published to the broker
     */
    publishMessage(message) {
        if (!this.subscribed) {
            return;
        }
        
        console.log(`published on topic "${this.pubTopic}": "${message}"`);
        
        let mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = this.pubTopic;

        this.mqtt.send(mqttMessage);
    }
}
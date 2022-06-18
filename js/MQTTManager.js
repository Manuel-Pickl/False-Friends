class MQTTManager {
    /*
        source: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
    */
    host;
    port;
    topic;
    mqtt;
    brokerLog;
    // topic == destinationName
    // connect("broker.mqttdashboard.com:8000");
    
    constructor() {
        this.brokerLog = document.querySelector(".modal .settings .broker-log");
        this.topic = "FalseFriends";
    }

    connect(ip) {
        let ipArray = ip.split(":");
        if (ipArray.length != 2) {
            this.brokerLog.textContent = "invalid ip";
            return;
        }

        this.host = ipArray[0];
        this.port = parseInt(ipArray[1]);

        // initialize broker connection
        this.mqtt = new Paho.MQTT.Client(this.host, this.port, "FalseFriends");
        this.mqtt.onMessageArrived = this.onMessageArrived;

        var options = {
            timeout: 3,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onFailure.bind(this)
        };
        this.mqtt.connect(options);
    }
    
    onConnect() {
        this.brokerLog.textContent = `Connected to broker at: ${this.host}:${this.port} with topic ${this.topic}`;
    }
    onFailure() {
        this.brokerLog.textContent = `No broker at: ${this.host}:${this.port}`;
    }
    
    subscribe() {
        this.mqtt.subscribe(this.topic);
    }

    unsubscribe() {
        this.mqtt.unsubscribe(this.topic);
    }

    onMessageArrived(message) {
        console.log(`${message.destinationName}: ${message.payloadString}`);
    }
}
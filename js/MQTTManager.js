class MQTTManager {
    /*
        source: https://www.eclipse.org/paho/index.php?page=clients/js/index.php
        broker: http://www.hivemq.com/demos/websocket-client/;
    */
    host;
    port;
    topic;
    mqtt;
    brokerLog;
    subscribed;
    message;
    
    constructor() {
        this.brokerLog = document.querySelector(".modal .settings .broker-log");
        this.topic = "FalseFriends";
        this.subscribed = false;
        this.message = "0,0,0";
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
        this.mqtt.onMessageArrived = this.onMessageArrived.bind(this);

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
        if (this.mqtt == null) {
            this.brokerLog.textContent = "no broker connected";
            return 1;
        }

        this.mqtt.subscribe(this.topic);
        this.subscribed = true;
    }

    unsubscribe() {
        this.mqtt?.unsubscribe(this.topic);
        this.subscribed = false;
    }

    onMessageArrived(message) {
        console.log(`${message.destinationName}: ${message.payloadString}`);

        this.message = message.payloadString;
    }
}
const mqtt = require('mqtt');
var express = require('express');
var router = express.Router();

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = 'mqtt://192.168.8.114:1883';
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('poubelle', {qos: 0} , function (err){
        if (!err) {
            console.log('Connection au topic');
        }
    });

    // When a message arrives, console.log it
    /*this.mqttClient.on('message', function (topic, message) {
      console.log("Received '" + JSON.parse(message)._id + "' on '" + topic + "'\n");
    });*/

    /*this.mqttClient.on('close', () => {
      console.log(`mqtt client disconnected`);
    });*/
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish('mytopic', message);
  }

  receiveMessage(){
    this.mqttClient.on('message', function (topic, message) {
        console.log("Received '" + JSON.parse(message)._id + "' on '" + topic + "'\n");
    });
  }
}

module.exports = MqttHandler;
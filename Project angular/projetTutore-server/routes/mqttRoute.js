const mqtt = require('mqtt');
var express = require('express');
var router = express.Router();
var dbMongo = require('../public/javascripts/dbMongo');

class MqttHandler {
  constructor() {
    this.mqttClientPbId = null;
    this.mqttClientPbHist = null;
    this.mqttClientLpId = null;
    this.mqttClientLpHist = null;
    this.host = 'mqtt://mqtt-brocker:1883';
  }
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClientPbId = mqtt.connect(this.host);
    this.mqttClientPbHist = mqtt.connect(this.host);
    this.mqttClientLpId = mqtt.connect(this.host);
    this.mqttClientLpHist = mqtt.connect(this.host);

    // Mqtt error calback
    this.mqttClientPbId.on('error', (err) => {
      console.log(err);
      this.mqttClientPbId.end();
    });

    this.mqttClientPbHist.on('error', (err) => {
      console.log(err);
      this.mqttClientPbHist.end();
    });

    this.mqttClientLpId.on('error', (err) => {
      console.log(err);
      this.mqttClientLpId.end();
    });

    this.mqttClientLpHist.on('error', (err) => {
      console.log(err);
      this.mqttClientLpHist.end();
    });

    // Connection callback
    this.mqttClientPbId.on('connect', () => {
      console.log(`mqtt client connected`);
    });
    this.mqttClientPbHist.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    this.mqttClientLpId.on('connect', () => {
      console.log(`mqtt client connected`);
    });
    this.mqttClientLpHist.on('connect', () => {
      console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClientPbId.subscribe('poubelle_id', {qos: 0} , (err) =>{
        if (!err) {
            console.log('Connection au topic');
        }
        this.mqttClientPbId.on('message', function (topic, message, packet) {
          let element = {};
          // message is Buffer§y
          console.log("Received '" + message + "' on '" + topic + "'\n");
          dbMongo.writeDataId(JSON.parse(message), 'poubelle_id');
          //client.end()
        })
    });

    this.mqttClientPbHist.subscribe('poubelle_hist', {qos: 0} , (err) =>{
      if (!err) {
          console.log('Connection au topic');
      }
      this.mqttClientPbHist.on('message', function (topic, message, packet) {
        let element = {};
        // message is Buffer§y
        console.log("Received '" + message + "' on '" + topic + "'\n");
        dbMongo.writeDataHist(JSON.parse(message), 'poubelle_hist');
        //client.end()
      })
    });

    this.mqttClientLpId.subscribe('lampadaire_id', {qos: 0} , (err) =>{
      if (!err) {
          console.log('Connection au topic');
      }
      this.mqttClientLpId.on('message', function (topic, message, packet) {
        let element = {};
        // message is Buffer§y
        console.log("Received '" + message + "' on '" + topic + "'\n");
        dbMongo.writeDataId(JSON.parse(message), 'lampadaire_id');
        //client.end()
      })
    });

    this.mqttClientLpHist.subscribe('lampadaire_hist', {qos: 0} , (err) =>{
      if (!err) {
          console.log('Connection au topic');
      }
      this.mqttClientLpHist.on('message', function (topic, message, packet) {
        let element = {};
        // message is Buffer§y
        console.log("Received '" + message + "' on '" + topic + "'\n");
        dbMongo.writeDataHist(JSON.parse(message), 'lampadaire_hist');
        //client.end()
      })
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
  /*sendMessage(message) {
    this.mqttClient.publish('mytopic', message);
  }

  receiveMessage(){
    this.mqttClient.on('message', function (topic, message) {
        console.log("Received '" + JSON.parse(message)._id + "' on '" + topic + "'\n");
    });
  }*/
}

module.exports = MqttHandler;
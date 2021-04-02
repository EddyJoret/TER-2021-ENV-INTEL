
class Mqtt{
  constructor() {
    this.mqtt = require('mqtt');
    this.client  = this.mqtt.connect('mqtt://192.168.8.114:1883');
    this.jsonResponse = {
      "dataMqtt": [],
    };
  }
  lancement = () =>{
    this.client.on('connect', function () {
      
        //subsribe au topic presence
      this.client.subscribe('poubelle', function (err) {
        if (!err) {
            console.log('Connection au mqtt');
            //publication du message 'hello mqtt" dans le topic presence
            //client.publish('presence', 'Hello mqtt')
            //permet de recevoir le message du client
            this.client.on('message', function (topic, message, packet) {
              let element = {};
              // message is Buffer
              console.log("Received '" + JSON.parse(message)._id + "' on '" + topic + "'\n");
              //client.end()
            })
        }
      })
    })
  }
  
}

 


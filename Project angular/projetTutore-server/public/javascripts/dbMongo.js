const mongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();


var connected = false;
var db = null;

let jsonResponse = {
    "handsetCards": [],
    "webCards": [],
    "tabPoubelleId": []
};

const uri = "mongodb+srv://pcazalis:pcazalis@projettutore.wpu3z.mongodb.net/capteurs?retryWrites=true&w=majority";

mongoClient.connect(uri, {useUnifiedTopology: true}).then(connection =>{
    connected = true;
    db = connection.db('capteurs');
    console.log("Connection à la base de données")
}).catch(error =>{
    console.log("erreur connection db");
});

async function queryCollection(){
    if(connected){
        
        const capteurHumCollection = await db.collection('poubelle').find().toArray();
        const poubelleIdCollection = await db.collection('poubelle_id').find().toArray();
        capteurHumCollection.forEach(element => {
            let handsetElement = {};
            /*handsetElement['_id'] = element['_id'];
            handsetElement['data'] = element['payload'].data;
            handsetElement['date'] = element['payload'].ts;*/
            handsetElement['_id'] = element['_id'];
            /*handsetElement['Lat'] = element['Lat'];
            handsetElement['Long'] = element['Long'];*/
            handsetElement['Coord'] = element['Coord'];
            handsetElement['Type'] = element['Type'];
            handsetElement['Seuil'] = element['Seuil'];
            handsetElement['Pression'] = element['Pression'];
            handsetElement['Date'] = element['Date'];
            //handsetElement['_msgid'] = element['_msgid'];
            jsonResponse.handsetCards.push(handsetElement);

            let webElement = {};
            /*webElement['_id'] = element['_id'];
            webElement['data'] = element['payload'].data;
            webElement['date'] = element['payload'].ts;*/
            webElement['_id'] = element['_id'];
            /*webElement['Lat'] = element['Lat'];
            webElement['Long'] = element['Long'];*/
            webElement['Coord'] = element['Coord'];
            webElement['Type'] = element['Type'];
            webElement['Seuil'] = element['Seuil'];
            webElement['Pression'] = element['Pression'];
            //webElement['_msgid'] = element['_msgid'];
            jsonResponse.webCards.push(webElement);

        });

        poubelleIdCollection.forEach(element => {
            let poubelleIdElement = {};
            poubelleIdElement['_id'] = element['_id'];
            poubelleIdElement['Coord'] = element['Coord'];
            jsonResponse.tabPoubelleId.push(poubelleIdElement);
        });

        return jsonResponse;
    }else{
        return null
    }
}


module.exports = {queryCollection, jsonResponse};
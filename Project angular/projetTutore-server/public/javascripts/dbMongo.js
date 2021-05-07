const mongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();


var connected = false;
var db = null;

let jsonResponse = {
    "handsetCards": [],
    "tabPoubelleId": []
};

const uri = "mongodb+srv://pcazalis:pcazalis@projettutore.wpu3z.mongodb.net/capteurs?retryWrites=true&w=majority";

const pizzaDocument = {
    name: "Neapolitan pizza",
    shape: "round",
    toppings: [ "San Marzano tomatoes", "mozzarella di bufala cheese" ],
};

mongoClient.connect(uri, {useUnifiedTopology: true}).then(connection =>{
    connected = true;
    db = connection.db('capteurs');
    console.log("Connection à la base de données")
}).catch(error =>{
    console.log("erreur connection db");
});

function writeDataId(data, collec){
    if(connected){
        db.collection(collec).save(data);
    }
}

function writeDataHist(data, collec){
    if(connected){
        db.collection(collec).insertOne(data);
    }
}

async function queryCollection(){
    if(connected){
        
        const capteurHumCollection = await db.collection('poubelle_hist').find().toArray();
        const poubelleIdCollection = await db.collection('poubelle_id').find().toArray();
        capteurHumCollection.forEach(element => {
            let handsetElement = {};
            /*handsetElement['_id'] = element['_id'];
            handsetElement['data'] = element['payload'].data;
            handsetElement['date'] = element['payload'].ts;*/
            handsetElement['_id'] = element['Poubelle_id'];
            handsetElement['Pression'] = element['Pression'];
            handsetElement['Date'] = element['Date'];
            //handsetElement['_msgid'] = element['_msgid'];
            jsonResponse.handsetCards.push(handsetElement);

        });

        poubelleIdCollection.forEach(element => {
            let poubelleIdElement = {};
            poubelleIdElement['_id'] = element['_id'];
            poubelleIdElement['Coord'] = element['Coord'];
            poubelleIdElement['Type'] = element['Type'];
            poubelleIdElement['Seuil'] = element['Seuil'];
            jsonResponse.tabPoubelleId.push(poubelleIdElement);
        });

        return jsonResponse;
    }else{
        return null
    }
}


module.exports = {queryCollection, jsonResponse, writeDataId, writeDataHist};
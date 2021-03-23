const mongoClient = require('mongodb').MongoClient;

var connected = false;
var db = null;

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
        let jsonResponse = {
            "handsetCards": [],
            "webCards": []
        };

        const capteurHumCollection = await db.collection('capteur_hum').find().toArray();
        capteurHumCollection.forEach(element => {
            let handsetElement = {};
            handsetElement['_id'] = element['_id'];
            handsetElement['data'] = element['payload'].data;
            handsetElement['date'] = element['payload'].ts;
            //handsetElement['_msgid'] = element['_msgid'];
            jsonResponse.handsetCards.push(handsetElement);

            let webElement = {};
            webElement['_id'] = element['_id'];
            webElement['data'] = element['payload'].data;
            webElement['date'] = element['payload'].ts;
            //webElement['_msgid'] = element['_msgid'];
            jsonResponse.webCards.push(webElement);

        });
        return jsonResponse;
    }else{
        return null
    }
}

module.exports = {queryCollection};
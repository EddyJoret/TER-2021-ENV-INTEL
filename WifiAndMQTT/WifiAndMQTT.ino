// if you have an ESP8266 based board
#define ESP8266

#if defined ESP8266 || defined ARDUINO_ESP8266_ESP01
#include <ESP8266WiFi.h>
#else
#include <WiFi.h>
#endif

#include <PubSubClient.h>

// Update these with values suitable for your network.

char* ssid = "Bbox-AAC99E7C";
char* password = "9P6HeG4ghiL275rEWg";

//char *topicin = "UPPA/test"; 
//char *topicout = "UPPA/test"; 
char *msgTemp  = "22.5"; 
char* mqtt_server = "192.168.1.67";

WiFiClient espClient;
PubSubClient client(espClient);

int WiFi_status = WL_IDLE_STATUS;

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
    // Wait 5 seconds before retrying  
      delay(5000);
    }
  }
}

void setup() {
  delay(3000);
  Serial.begin(115200);

// Print a start message  
  Serial.println(F("Simple MQTT demo")); 
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  //client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();  
  WiFi_status = WiFi.status();
  
  if ( WiFi_status != WL_CONNECTED) {
  while ( WiFi_status != WL_CONNECTED) {
      Serial.print("Attempting to connect to WPA SSID: ");
      Serial.println(ssid);
      // Connect to WPA/WPA2 network
      WiFi_status = WiFi.begin(ssid, password);
      delay(500);
    }
    Serial.println("Connected to AP");   
  } 
  Serial.print("Publishing: status=");

  /*int e=client.publish(topicout, msgTemp);
  Serial.println(e); */
  delay(7500);   
 }                 

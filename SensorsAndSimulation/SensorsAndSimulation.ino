// if you have an ESP8266 based board
#define ESP8266

#if defined ESP8266 || defined ARDUINO_ESP8266_ESP01
  #include <ESP8266WiFi.h>
#else
  #include <WiFi.h>
#endif

#include <PubSubClient.h>

// Variables pour connection WiFi et MQTT avec ses topics
//    WiFI
char* ssid = "Bbox-AAC99E7C";
char* password = "9P6HeG4ghiL275rEWg";

//    MQTT & topics
char* mqtt_server = "192.168.1.67";
char *topicPoub = "poubelle"; 
char *topicLum = "lumiere";

WiFiClient espClient;
PubSubClient client(espClient);

int WiFi_status = WL_IDLE_STATUS

// Variables pour le capteur photosensible
int photocellPin = A0;
int photocellReading;
bool nuit;

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
  Serial.begin(115200);
  delay(3000);
  
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  
  photocellReading = analogRead(photocellPin);
  if(photocellReading < 300){
    nuit = true;
  }else{
    nuit = false;
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  photocellReading = analogRead(photocellPin);
  Serial.print("Analog reading = ");
  Serial.print(photocellReading);

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
  
  if(photocellReading < 300){
    Serial.print(" - Night");
    if(nuit){
      Serial.println(" : not send, night is already here");
    }else{
      nuit = true;
      Serial.println(" : send, night is here");
    }
  }else{
    Serial.print(" - Day");
    if(nuit){
      nuit = false;
      Serial.println(" : send, day is here");
    }else{
      Serial.println(" : not send, day is already here");
    }
  }
  delay(2000);
}

//Fonction pour publier un float sur un topic 
void mqtt_publishFloat(String topic, float t){
  char top[topic.length()+1];
  topic.toCharArray(top,topic.length()+1);
  char t_char[50];
  String t_str = String(t);
  t_str.toCharArray(t_char, t_str.length() + 1);
  client.publish(top,t_char);
}

//Fonction pour publier un int sur un topic 
void mqtt_publishInt(String topic, int t){
  char top[topic.length()+1];
  topic.toCharArray(top,topic.length()+1);
  char t_char[50];
  String t_str = String(t);
  t_str.toCharArray(t_char, t_str.length() + 1);
  client.publish(top,t_char);
}

//Fonction pour publier un String sur un topic 
void mqtt_publishString(String topic, String t){
  char top[topic.length()+1];
  topic.toCharArray(top,topic.length()+1);
  char t_char[50];
  t.toCharArray(t_char, t.length() + 1);
  client.publish(top,t_char);
}

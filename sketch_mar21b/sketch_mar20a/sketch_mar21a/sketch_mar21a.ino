// from https://github.com/esp8266/Arduino/blob/3e7b4b8e0cf4e1f7ad48104abfc42723b5e4f9be/variants/nodemcu/pins_arduino.h
/*const uint8_t D0   = 16;
const uint8_t D1   = 5;
const uint8_t D2   = 4;
const uint8_t D3   = 0;
const uint8_t D4   = 2;
const uint8_t D5   = 14;
const uint8_t D6   = 12;
const uint8_t D7   = 13;
const uint8_t D8   = 15;
const uint8_t D9   = 3;
const uint8_t D10  = 1;*/

//#define WIFI_USED
#define WIFI_SSID "Bbox-AAC99E7C"
#define WIFI_PWD "9P6HeG4ghiL275rEWg"

#define SEND_INVALID 1

#define TOPIC_PREFIX "/smart-villa/etage1/"

#define LIGHT_SENS
#define LIGHT_TOPIC "lum"
#define LIGHT_PIN A0

#define DHT_SENS
#define DHT_HUMIDITE_TOPIC "hum"
#define DHT_TEMPERATURE_TOPIC "temp"
#define DHT_PIN D0

#define MOTION_SENS
#define MOTION_TOPIC "mouv"
#define PIR_PIN D2

#define DIST_SENS
#define DIST_TOPIC "dist"
#define TRIG_PIN D5
#define ECHO_PIN D6

#ifdef WIFI_USED
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#endif

#ifdef DHT_SENS
#include <DHT.h>
DHT dht(DHT_PIN, DHT11);
#endif

#ifdef MOTION_SENS
// boolean indicating wether something was detected last cycle
bool motionLastState;
#endif


void setup() {
  // initialize serial communication:
  Serial.begin(115200);
  delay(3000);
#ifdef WIFI_USED
  WiFi.begin(WIFI_SSID, WIFI_PWD);
  Serial.print("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.println();
  
  Serial.print("Connected as ");
  Serial.println(WiFi.localIP());

  // cc "https://iotdesignpro.com/projects/how-to-connect-esp8266-with-mqtt"
  while(!client.connected()) {
    Serial.println("Connection to MQTT...");
    if (client.connect("ESP8266Client", "", "")) {
       Serial.println("Connected");
    } else {
      Serial.print("failed with state");
      Serial.println(client.state());
      delay(2000);
    }
  }
#endif
}

void loop() {
  // put your main code here, to run repeatedly:

}

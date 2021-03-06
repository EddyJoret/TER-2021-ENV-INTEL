/*This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.*/
    
 /********************
 * Program:  DHT22 humidity-temperature sensor tester, 
 *           HC-SR04 sensor tester
 *           Light sensor Tester
 *           PIR sensor tester
 * Description: print humidity temperature to serial 
 *              print distance to serial
 *              print motion movement
 *              print light boolean
 ********************/

#include <DHT.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <WifiLocation.h>

//Constants

// Update these with values suitable for your network.
#define WIFI_SSID ""
#define WIFI_PWD ""
#define MQTT_IP IPAddress(0, 0, 0, 0)
#define MQTT_PORT 1880
#define MQTT_NAME ""
#define MQTT_PWD ""
#define API_KEY ""

#define TOPIC_PREFIX "smart-villa/etage1/esp32/"

#define DHT_SENSOR
#define DISTANCE_SENSOR
//#define LIGHT_SENSOR
//#define MOTION_SENSOR

#ifdef DHT_SENSOR
    #define TOPIC_HUM "hum"
    #define TOPIC_TEMP "temp"
    #define DHT_PIN 0           // what pin on the arduino is the DHT22 data line connected to
    //#define DHT_TYPE DHT22    // DHT 22  (AM2302)
    #define DHT_TYPE DHT11      // DHT 11
    DHT dht(DHT_PIN, DHT_TYPE); // Initialize DHT sensor for normal 16mhz Arduino
#endif

#ifdef DISTANCE_SENSOR
    #define TOPIC_DIST "dist"
    #define ECHO_PIN 2
    #define TRIG_PIN 4
    float v = 331.5+0.6*20;       // m/s
#endif

#ifdef LIGHT_SENSOR
    #define TOPIC_LIGHT "lum"
    #define LIGHT_SENSOR_PIN 32
    #define LIGHT_LED_PIN 26
    int photocellReading;       // the analog reading from the analog resistor divider
#endif

#ifdef MOTION_SENSOR
    #define TOPIC_MOTION "mouv"
    #define PIR_PIN 5           // choose the input pin (for PIR sensor)
    int pirState = LOW;         // we start, assuming no motion detected
    int detect = 0;                 // variable for reading the pin status
#endif

WiFiClient espClient;
PubSubClient client{MQTT_IP, MQTT_PORT, espClient};
long lastMsg = 0;
char msg[50];
int value = 0;
WifiLocation location(API_KEY);

void logValue(const char category[], float value) {
    String raw{value};
    String topic{TOPIC_PREFIX};
    topic += category;
    client.publish(topic.c_str(), raw.c_str());
}

void setup_wifi() {
    delay(10);
    // We start by connecting to a WPA/WPA2 network
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(WIFI_SSID);

    WiFi.mode(WIFI_MODE_STA);

    WiFi.begin(WIFI_SSID, WIFI_PWD);

    while (WiFi.status() != WL_CONNECTED) {
        Serial.print("Attempting to connect to WPA SSID: ");
        Serial.println(WIFI_SSID);
        // wait 5 seconds for connection:
        Serial.print("Status = ");
        Serial.println(WiFi.status());
        delay(500);
    }
    location_t loc = location.getGeoFromWiFi();

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: " + String(WiFi.localIP()));
    Serial.println("Location request data");
    Serial.println(location.getSurroundingWiFiJson());
    Serial.println("Latitude: " + String(loc.lat, 7));
    Serial.println("Longitude: " + String(loc.lon, 7));
    Serial.println("Accuracy: " + String(loc.accuracy));
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

//Reconnect
void reconnect() {
    // Loop until we're reconnected
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
            if (client.connect("ESP32Client")) {
            Serial.println("connected");
        }
        else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(500);
        }
    }
}

void setup() { // to run once
    Serial.begin(115200);         // Initialize the serial port

    #ifdef DHT_SENSOR
        Serial.println("DHT22 Humidity - Temperature Sensor");
        Serial.println("RH (%)\t\t Temp (??C)");
        dht.begin();
    #endif
    #ifdef DISTANCE_SENSOR
        pinMode(TRIG_PIN, OUTPUT);
        digitalWrite(TRIG_PIN, LOW);
        pinMode(ECHO_PIN, INPUT);
    #endif
    #ifdef LIGHT_SENSOR
        pinMode(LIGHT_LED_PIN, OUTPUT);     // declare led pin as OUTPUT
    #endif
    #ifdef MOTION_SENSOR
        pinMode(PIR_PIN, INPUT);     // declare sensor as INPUT
        // Set motionSensor pin as interrupt, assign interrupt function and set RISING mode
    #endif

    setup_wifi();
    client.setServer(MQTT_IP, MQTT_PORT);
    client.setCallback(callback);
}

void loop() {

    if (!client.connected()) {
        reconnect();
    }
    client.loop();

    //Publish The Sensor Data
    #ifdef DHT_SENSOR
    {
        // Reading temperature or humidity takes about 250 milliseconds!
        // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
        float h = dht.readHumidity();
        float t = dht.readTemperature();
        // Check if any reads failed and exit early (to try again).
        if (isnan(h) || isnan(t) && DHT_TYPE==DHT22) {
            Serial.println("Failed to read from DHT22 sensor!");
            return;
        }
        else if (isnan(h) || isnan(t) && DHT_TYPE==DHT11) {
            Serial.println("Failed to read from DHT11 sensor!");
            return;
        }
        Serial.print(h);
        logValue(TOPIC_HUM, h);
        Serial.print(" \t\t");
        Serial.println(t);
        logValue(TOPIC_TEMP, t);
    }
    #endif

    #ifdef DISTANCE_SENSOR
    {
        // send sound pulse
        digitalWrite(TRIG_PIN, HIGH); // pulse started
        delayMicroseconds(12);
        digitalWrite(TRIG_PIN, LOW);  // pulse stopped

        // listen for echo
        float tUs = pulseIn(ECHO_PIN, HIGH); // microseconds
        float distance = tUs / 58;    // cm
        Serial.print(distance, DEC);
        Serial.println("cm");
        logValue(TOPIC_DIST, distance);
    }
    #endif

    #ifdef LIGHT_SENSOR
    {
        photocellReading = analogRead(LIGHT_SENSOR_PIN); // read the current light levels
        Serial.print("Analog reading = ");
        Serial.print(photocellReading);         // the raw analog reading
        // We'll have a few threshholds, qualitatively determined
        if (photocellReading < 10) {
            Serial.println(" - Black");
            digitalWrite (LIGHT_LED_PIN, HIGH);   // turn on light
        } else if (photocellReading < 200) {
            Serial.println(" - Dark");
            digitalWrite (LIGHT_LED_PIN, LOW);    // turn on light
        } else if (photocellReading < 500) {
            Serial.println(" - Light");
            digitalWrite (LIGHT_LED_PIN, LOW);    // turn off light
        } else if (photocellReading < 800) {
            Serial.println(" - Luminous");
            digitalWrite (LIGHT_LED_PIN, LOW);    // turn off light
        } else {
            Serial.println(" - Bright");
            digitalWrite (LIGHT_LED_PIN, LOW);    // turn off light
        }
        logValue(TOPIC_LIGHT, photocellReading);
    }
    #endif

    #ifdef MOTION_SENSOR
    {
        detect = digitalRead(PIR_PIN);     // read input value
        if (detect == HIGH) {              // check if the input is HIGH
            if (pirState == LOW) {
                // we have just turned on
                Serial.println("Motion detected!");
                // We only want to print on the output change, not state
                pirState = HIGH;
            }
        } else {
            if (pirState == HIGH){
                // we have just turned of
                Serial.println("Motion ended!");
                // We only want to print on the output change, not state
                pirState = LOW;
            }
        }
        logValue(TOPIC_MOTION, detect);
    }
    #endif

    //client.loop();

    // Wait a few seconds between measurements. The DHT22 should not be read at a higher frequency of
    // about once every 2 seconds. So we add a 3 second delay to cover this.
    delay(3000);
}
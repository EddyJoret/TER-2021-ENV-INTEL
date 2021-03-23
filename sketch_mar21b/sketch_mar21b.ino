#define ARDUINO_ARCH_ESP8266
//#define WIFI_USED
#define WIFI_SSID "Bbox-AAC99E7C"
#define WIFI_PWD "9P6HeG4ghiL275rEWg"

#define MQTT_IP "127.0.0.1"
#define MQTT_PORT 4546

    #ifdef ARDUINO_ARCH_ESP8266
        #include <ESP8266WiFi.h>
    #endif

    #ifdef ARDUINO_ARCH_ESP32
        #include <WiFi.h>
    #endif

    #include <PubSubClient.h>
    WiFiClient espClient;
    PubSubClient client{MQTT_IP, MQTT_PORT, espClient};

    void setup_wifi() {
        delay(10);
        // We start by connecting to a WPA/WPA2 network
        Serial.println();
        Serial.print("Connecting to ");
        Serial.println(WIFI_SSID);

        // Set WiFi to station mode and disconnect from an AP if it was previously connected
        #ifdef ARDUINO_ARCH_ESP8266
            WiFi.mode(WIFI_STA);
        #endif

        #ifdef ARDUINO_ARCH_ESP32
            WiFi.mode(WIFI_STA);
        #endif

        WiFi.begin(WIFI_SSID, WIFI_PWD);

        while (WiFi.status() != WL_CONNECTED) {
            Serial.print("Attempting to connect to WPA SSID: ");
            Serial.println(WIFI_SSID);
            // wait 5 seconds for connection:
            Serial.print("Status = ");
            Serial.println(WiFi.status());
            delay(500);
        }
        Serial.println("");
        Serial.println("WiFi connected");
        Serial.print("IP address: ");
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

    //Reconnect
    void reconnect() {
        // Loop until we're reconnected
        while (!client.connected()) {
            Serial.print("Attempting MQTT connection...");
            if (client.connect("VaTeFaireEnculerCordialementEddyJoret")) {
                Serial.println("connected");
            }
            else {
                Serial.print("failed with state, rc=");
                Serial.print(client.state());
                Serial.println(" try again in 5 seconds");
                // Wait before retrying
                delay(5000);
            }
        }
    }

void setup() {
  // initialize serial communication:
  Serial.begin(115200);
    setup_wifi();
    client.setServer(MQTT_IP, MQTT_PORT);
    client.setCallback(callback);
}

void loop() {
  // put your main code here, to run repeatedly:
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
}

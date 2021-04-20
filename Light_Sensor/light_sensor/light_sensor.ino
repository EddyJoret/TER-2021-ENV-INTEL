int photocellPin = A0; // the cell and 10K pulldown are connected to A0
int photocellReading; // the analog reading from the analog resistor divider
bool nuit;

void setup() {
  // We'll send debugging information via the Serial monitor
  Serial.begin(115200);
  photocellReading = analogRead(photocellPin);
  if(photocellReading < 300){
    nuit = true;
  }else{
    nuit = false;
  }
}

void loop() {
  photocellReading = analogRead(photocellPin);
  Serial.print("Analog reading = ");
  Serial.print(photocellReading);
  
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

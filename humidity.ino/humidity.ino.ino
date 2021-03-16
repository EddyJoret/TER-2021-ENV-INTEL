/********************
 * Soil humidity sensor tester
 * Read soil humidity by measuring its resistance.
 ********************/

int sensorPin = A0;
int moisture;
int percentage;

int sec = 300;
int humide = 34;

/* Barrème pour le seuil 
 *  petite poubelle grise/noire (organiques et non triés) : x kilos
 *  grande poubelle grise/noire (organiques et non triés) : x kilos
 *  petite poubelle jaune (recyclage): y kilos
 *  grande poubelle jaune (recyclage) : y kilos
 *  petite poubelle verte (verre): z kilos
 *  grande poubelle verte (verre) : z kilos
*/
int seuil = 70;

//int soilHumidity = -1;

void setup() {
  Serial.begin(9600);
}

void loop() {
  moisture= analogRead(sensorPin);
  percentage = map(moisture, humide, sec, 100, 0);
  Serial.print("{\"Rempli\": ");
  if(percentage < seuil){
    Serial.print(0);
  }else{
    Serial.print(1);
  }
  Serial.print(",\"Seuil\": ");
  Serial.print(seuil);
  Serial.print(",\"Percentage\": ");
  Serial.print(percentage);
  //Serial.print(percentage);
  Serial.println("}");
  //Serial.println("%");
  
  delay(1000);
}

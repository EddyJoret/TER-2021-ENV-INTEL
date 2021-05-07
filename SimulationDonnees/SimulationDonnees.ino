#include <math.h>


//Variables seuil, pression, lat et long pour les poubelles type verre
const int verreSeuil = 1000;
const int NbVerre = 4;
const String verreLat[NbVerre] = {"43.3139091308801", "43.31441297592778", "43.310851203441516", "43.31198829383463"};
const String verreLong[NbVerre] = {"-0.3745144816347811", "-0.3705300904737857", "-0.3657702935847785", "-0.3671455772337487"};
int verrePression[] = {0, 0, 0, 0};

//Variables seuil, pression, lat et long pour les poubelles type commun
const int communSeuil = 800;
const int NbCommun = 4;
const String communLat[NbCommun] = {"43.31083634182449", "43.322645274024055", "43.31883132515931", "43.314000596748365"};
const String communLong[NbCommun] = {"-0.36568324360262056", "-0.3567479946432236", "-0.3396374862646479", "-0.3402880848906379"};
int communPression[] = {0, 0, 0, 0};

//Variables seuil, pression, lat et long pour les poubelles type recyclage
const int recyclageSeuil = 700;
const int NbRecyclage = 4;
const String recyclageLat[NbRecyclage] = {"43.310834473981316", "43.32259687120946", "43.318853551238696", "43.31407140746098"};
const String recyclageLong[NbRecyclage] = {"-0.36565460107083053", "-0.35679448156620447", "-0.33974327178516034", "-0.3402764522535189"};
int recyclagePression[] = {0, 0, 0, 0};

String msg;

void setup(){
  Serial.begin(115200);
  delay(3000);

  setupBDId();
  setupBDHist();
}

void setupBDId(){
  Serial.println("Initialisation données pour ID");
  int j = 0;
  for(int i = 1; i <= (NbVerre + NbCommun + NbRecyclage); i++){
    j = j % 4;
    if(i <= NbVerre){
      msg = "{\"_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + verreLat[j] + ", \"Long\":" + verreLong[j] + "}, \"Type\":\"Verre\", \"Seuil\":" + verreSeuil + "}";
    }else if(i <= (NbVerre + NbCommun)){
      msg = "{\"_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + communLat[j] + ", \"Long\":" + communLong[j] + "}, \"Type\":\"Commun\", \"Seuil\":" + communSeuil + "}";
    }else{
      msg = "{\"_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + recyclageLat[j] + ", \"Long\":" + recyclageLong[j] + "}, \"Type\":\"Recyclage\", \"Seuil\":" + recyclageSeuil + "}";
    }
    //envoie sur le topic correcpondant pour l'initialisation de la BD
    Serial.print("Msg ID init: ");
    Serial.println(msg);
    j++;  
  }
  Serial.println("Fin initialisation ID");
  Serial.println();
}

void setupBDHist(){
  Serial.println("Initialisation données pour BD");
  int j = 0;
  for(int i = 1; i <= (NbVerre + NbCommun + NbRecyclage); i++){
    j = j % 4;
    if(i <= NbVerre){
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + verreLat[j] + ", \"Long:\"" + verreLong[j] + "}, \"Pression\":0, \"Date\":"   + "}";
    }else if(i <= (NbVerre + NbCommun)){    
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + communLat[j] + ", \"Long\":" + communLong[j] + "}, \"Pression\":0, \"Date\":"  + "}";
    }else{
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + recyclageLat[j] + ", \"Long\":" + recyclageLong[j] + "}, \"Pression\":0, \"Date\":"  + "}";
    }
    //envoie sur le topic correcpondant pour l'initialisation de la BD
    Serial.print("Msg init: ");
    Serial.println(msg);
    j++;  
  }
  Serial.println("Fin initialisation Hist");
  Serial.println();
  delay(30000);
}

void MajPressionVerre(int j){
  int pression = verrePression[j];
  if(pression < verreSeuil){
   verrePression[j] = pression + round(random(pression, (verreSeuil - pression)+50) / 2)  ;
  }
}

void MajPressionCommun(int j){
  int pression = communPression[j];
  if(pression < communSeuil){
   communPression[j] = pression + round(random(pression, (verreSeuil - pression)+50) / 2)  ;
  }
}

void MajPressionRecyclage(int j){
  int pression = recyclagePression[j];
  if(pression < recyclageSeuil){
   recyclagePression[j] = pression + round(random(pression, (verreSeuil - pression)+50) / 2)  ;
  }
}

void loop(){
  Serial.println("Début maj pression");
  int j = 0;
  for(int i = 1; i <= (NbVerre + NbCommun + NbRecyclage); i++){
    j = j % 4;
    if(i <= NbVerre){
      MajPressionVerre(j);
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + verreLat[j] + ", \"Long\":" + verreLong[j] + "}, \"Pression\":" + verrePression[j] + ", \"Date\":"  + "}";
    }else if(i <= (NbVerre + NbCommun)){  
      MajPressionCommun(j);
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + communLat[j] + ", \"Long\":" + communLong[j] + "}, \"Pression\":" + communPression[j] + ", \"Date\":"  + "}";
    }else{
      MajPressionRecyclage(j);
      msg = "{\"poubelle_id\":" + String(i) + ", \"Coord\":{\"Lat\":" + recyclageLat[j] + ", \"Long\":" + recyclageLong[j] + "}, \"Pression\":" + recyclagePression[j] + ", \"Date\":"  + "}";
    }
    //envoie sur le topic correcpondant pour l'affichage
    Serial.print("Msg maj: ");
    Serial.println(msg);
    j++;  
  }
  Serial.println("Fin maj pression");
  delay(30000);
  Serial.println();
}

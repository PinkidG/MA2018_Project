# NewMed - Backend

Die für die App **NewMed** notwendige Backend-Infrastruktur wird von einem eigens entwickelten *Node.js*-Server mit einer angeschlossenen *MongoDB*-Datenbank realisiert. 

## Installation 
**Wichtig**: Bevor der Server gestartet werden kann, muss eine MongoDB-Instanz gestartet werden. Information über die Installation sind <a href="https://docs.mongodb.com/manual/installation/">hier</a> zu finden.

Zum Starten des Servers ist lediglich eine aktuelle Version von _Node.js_ und _npm_ erforderlich. Anschließend müssen die folgenden zwei Schritte durchgeführt werden:
1.  Im "Server"-Ordner den Befehl `npm install` ausführen
2.  Im Ordner "backend" den Befehl `node Server` ausführen

Damit wird eine Instanz des Servers auf dem Port 3000 gestartet. Dazu ist es erforderlich, dass dieser Port bisher nicht belegt ist. Außerdem startet der Server nur bei einer erfolgreichen Verbindung zu der MongoDB. 

Der Server kann auch mithilfe eines DNS-Servers so konfiguriert werden, dass er über das Internet verfügbar ist. Hier sollte man besonders auf die korrekte Einstellung des Port-Forwaddings achten.

### Test-Instanz
Es ist bereits eine Test-Instanz des Backend-Servers verfügbar. Die URL für den API-Endpoint lautet:
-   http://pinkisworld.ddnss.de/api

Testuser, die in diesem System bereitstehen lauten:
-   Doktoren:
    -   gio@doctor.com
    -   steven@doctor.com
-   Patienten:
    -   maxima@patient.com
    -   pppinki@patient.com
    -   lisa@patient.com
    -   max@gmail.com
    -   heinrich@gmx.de

Das Passwort für die jeweiligen Accounts lautet: **1234**

_Anmerkung_: Die Verfügbarkeit dieses Testservers kann nicht garantiert werden, da er privat gehostet wird. 

## Inhalt
Der Node-Server stellt die zentrale Anlaufstelle der Applikation dar. Sämtliche Nutzerdaten und Informationen, die in der App genutzt werden über den Server verwaltet. Hier finden Sie einen Überblick über die wichtigsten Code-Elemente:

-   <a href="Server/index.js">index.js</a>: Startpunkt des Servers, Access-Control und Plugins werden hier konfiguriert
-   <a href="Server/router.js">router.js</a>: Enthält alle Routen, die über die REST-API angesprochen werden können
-   <a href="Server/config/main.js">main.js</a>: Parameter für den Start des Servers, Server- und MongoDB-Port können heir geändert werden
-   <a href="Server/controllers">controllers</a>: Enthält alle verfügbaren Controller, REST-Funktionen sind hier definiert
-   <a href="Server/models">models</a>: Objekte, die in der Datenbank abgebildet werden

### Plugins
Zur Vereinfachung der ENtwicklung wurden folgende Plugins verwendet:

-   **Passport** - Authentisierungs-Plugin ([Link](http://www.passportjs.org/))
-   **Mongoose** - Kommunikation mit MongoDB ([Link](http://mongoosejs.com/))
-   **accesscontrol** - Rollenverwaltung auf dem Server ([Link](https://www.npmjs.com/package/accesscontrol))

Es gelten die jeweiligen Lizenzen der Plugins.

## Lizenz
Copyright [2018] [Steven Dal Pra, Anne Hänzka, Philipp Pinkernelle & Philipp Reichel]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

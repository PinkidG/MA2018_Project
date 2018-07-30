# NewMed - Frontend

Die Applikation wurde mit **Cordova** entwickelt. Dieses Framework zur Entwicklung hybrider Mobilanwednungen stellt eine plattformübergreifende Funktionalität sicher. Als grafische Oberfläche verwenden wir **Ionic** (Version 1).

## Bilder
Hier sind ein paar Screenshots der App zu sehen:

<img align="left" src="Screenshots/IMG_0006.PNG" width="200px" title="Login" hspace="20" border="3"/>
<img align="left" src="Screenshots/IMG_0007.PNG" width="200px" title="Patient" hspace="20" border="3"/>
<img align="left" src="Screenshots/IMG_0008.PNG" width="200px" title="Video" hspace="20" border="3"/>
<img align="left" src="Screenshots/IMG_0009.PNG" width="200px" title="Share" hspace="20" border="3"/>
<img align="left" src="Screenshots/IMG_0010.PNG" width="200px" title="Frage" hspace="20" border="3"/>
<img align="left" src="Screenshots/IMG_0011.PNG" width="200px" title="Arzt" hspace="20" border="3"/>

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
## Installation 

Damit die App getestet werden kann, müssen folgende Pakete installiert sein:
-   Ionic (`npm install -g ionic`)
-   Cordova (`npm install -g cordova`)
-   iOS-Deploy (`npm install -g ios-deploy`) (mögliche Installationsprobleme: <a href="https://github.com/ios-control/ios-deploy/issues/346">Github-Issue</a>, nur für Deployment auf echtem iOS-Device notwendig)
-    Bower (`npm install -g bower`)


Anschließend kann die App kompiliert werden. Dazu müssen die folgenden Schritte im 'Sourcecode'-Ordner ausgeführt werden:
1.  `npm install`
2.  `cordova plugins add cordova-plugin-share` (Plugin wird nicht richtig gespeichert)
3.  `cordova prepare`
4.  `bower install`

Um die App zu starten stehen anschließend folgende Befehle zur Verfügung:

-   Auf iOS Gerät (empfohlen):
    - `ionic cordova run ios --prod`
    - Getestet unter iOS 11.4
    - Bietet die beste Experience
    - Auch im Simulator möglich
    - Eventuell müssen Zertifikatsprobleme manuell behoben werden (siehe <a href="https://cordova.apache.org/docs/en/2.5.0/guide/getting-started/ios/#deploy-to-the-device">hier</a>)
-   Im Browser mit Ionic-Lab:
    - `ionic serve -p 8080 -l`
    - Eingeschränkter Funktionsumfang
-   Reine Browser-Darstellung (Nicht Empfohlen):
    -   `ionic serve -p 8080`
    - Eingeschränkter Funktionsumfang
    - Eventuell grafisch-fehlerhaft Darstellung

Anmerkung: Die App wurde nicht unter Android getestet. Die grundlegenden Funktionalitäten sollten aber zur Verfügung stehen.

## Inhalt



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
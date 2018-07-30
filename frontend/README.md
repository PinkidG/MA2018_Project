# NewMed - Frontend

Die Applikation wurde mit **Cordova** entwickelt. Dieses Framework zur Entwicklung hybrider Mobilanwednungen stellt eine plattformübergreifende Funktionalität sicher. Als grafische Oberfläche verwenden wir **Ionic** (Version 1).

## Bilder
Hier sind ein paar Screenshots der App zu sehen:

<table>
    <tr>
        <td>
            <img align="left" src="Screenshots/IMG_0006.PNG" width="200px" title="Login" hspace="20"/>
        </td>
        <td>
            <img align="left" src="Screenshots/IMG_0007.PNG" width="200px" title="Patient" hspace="20"/>
        </td>
        <td>
            <img align="left" src="Screenshots/IMG_0008.PNG" width="200px" title="Video" hspace="20"/>
        </td>
    </tr>
    <tr>
        <td>
            <img align="left" src="Screenshots/IMG_0009.PNG" width="200px" title="Share" hspace="20"/>
        </td>
        <td>
            <img align="left" src="Screenshots/IMG_0010.PNG" width="200px" title="Frage" hspace="20"/>
        </td>
        <td>
            <img align="left" src="Screenshots/IMG_0011.PNG" width="200px" title="Arzt" hspace="20"/>
        </td>
    </tr>
</table>

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

### Konfiguration
Es besteht die Möglichkeit, die Anwendung mit einem lokalem Backend-Server zu testen (nur im Browser). Defür muss in der <a href="Sourcecode/www/js/services.js">services.js</a>-Datei die Variable `let USELOCASERVER = false;` auf `true`gesetzt werden. 

Gleichzeitig kann der API-Endpoint (lokal als auch online) in der <a href="Sourcecode/www/js/constants.js">constants.js</a> geändert werden.


## Inhalt

Hier ist eine Auflistung der wichtigsten Code-Elemente:
-   <a href="Sourcecode/www/js/app.js">app.js</a>: Startpunkt der Anwendung, enthält die Konfiguration von Ionic
-   <a href="Sourcecode/www/js/controllers.js">controllers.js</a>: Enthält alle View-Controller, Funktionen der Oberfläche
-   <a href="Sourcecode/www/js/services.js">services.js</a>: Kommunikationsschnittstellen mit dem Backend
-   <a href="Sourcecode/www/js/constants.js">constants.js</a>: Konstanten der Backend-API-URL
-   <a href="Sourcecode/www/js/routes.js">routes.js</a>: Routen der Views der Anwenung
-   <a href="Sourcecode/www/templates">HTML-Templates</a>: Ordner mit allen HTML-Templates der Anwendung

Außerdem werden hier die wichtigsten verwendeten Plugins aufgezählt.:

| Name | Beschreibung|
|-|-|
|<a href="https://github.com/apache/cordova-plugin-dialogs">cordova-plugin-dialogs</a>| Darstellung von Popups als native Elemente (iOS/Android)|
|<a href="https://github.com/EddyVerbruggen/cordova-plugin-touch-id">cordova-plugin-touch-id</a>| Plugin für die Nutzung von Touch-ID und Face-ID unter iOS|
|<a href="https://github.com/apache/cordova-plugin-camera">cordova-plugin-camera</a>| Zugriff auf die Kamera-Galerie der App (iOS/Android)|
|<a href="https://github.com/dpa99c/phonegap-launch-navigator">phonegap-launch-navigator</a>| Navigator starten|
|<a href="https://github.com/nordnet/cordova-universal-links-plugin">cordova-universal-links-plugin</a>| Erlaubt die Nutzung von Deep-Links (in Verbindung mit <a href="https://branch.io/">Branch</a>) |
|<a href="https://github.com/nordnet/cordova-universal-links-plugin">cordova-universal-links-plugin</a>| Erlaubt die Nutzung von Deep-Links (in Verbindung mit <a href="https://branch.io/">Branch</a>). Mehr Informationen weiter unten. |
|<a href="https://github.com/markmarijnissen/cordova-plugin-share">cordova-plugin-share</a>| Verwendung der Share-Extension auf mobilen Geräten (iOS/Android) |


Weitere Plugins sind in der <a href="Sourcecode/config.xml">config.xml</a> aufgelistet. Es gelten die Lizenzen der jeweiligen Plugins.

### Deep-Links

Mit der App ist es möglich einen Link für Fragen und Videos zu erstellen. Diese können anschließend über eine Share-Extension an andere Kontakte oder Nutzer in der Nähe gesendet werden. Die Links können auch direkt als Antwort einer Frage eingefügt werden. Ein Nutzer, der auf den Link klickt und die App installiert hat, wird umgehend zu der entsprechenden Ressource weitergeleitet.

Die Links wurden mithilfe von <a href="https://branch.io/">Branch</a> erstellt und weisen folgende Struktur auf:
`http://newmeddhbw.app.link?topicId=17` bzw. `http://newmeddhbw.app.link?videoId=19`

Stehen die Ressourcen der angegebenen Id nicht zur Verfügung, erhält der Nutzer eine Fehlermeldung in der App.

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

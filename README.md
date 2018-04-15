# Mobile Applikationen - Projekt

#### Beschreibung
Im Rahmen der Vorlesung _Mobile Applikationen_ des Studienfachs Wirtschaftsinformatik an der DHBW Mannheim soll eine mobile Applikation mit einem relevanten Business-Usecase entwickelt werden.

Die Idee unseres Teams umfasst die Entwicklung einer Anwendung für das Universitätsklinikum Heidelberg. In Absprache mit dem Oberarzt Dr. med. Giovanni Frongia, der maßgeblich an der Konzeptionierung beteiligt ist,  haben wir verschiedene Usecases evaluiert und für eine prototypische Implementierung zusammengesucht.

#### Inhalt
Das auf GitHub öffentlich verfügbare Repository enthält alle Entwicklungen sowie Dokumentationen und andere Resourcen, die zur Ausarbeitung des Projektes dienen.

Link: [Repository](https://github.com/PinkidG/MA2018_Project "Link to GitHub")

***

## Anwendung

Die mobile Anwendung soll verschieden Funktionen bieten, die im folgenden aufgelistet und erläutert werden. Der Titel der App lautet: _&lt;Name&gt;_. Die Anwendung soll auf allen mobilen Plattformen laufen. Zu Testzwecken wird bei der Entwicklung der Einsatz auf iOS, Android und einem Webbrowser überprüft und sichergestellt.

#### Idee

Der Alltag für Ärzte besteht aus der häufigen Wiederholung von Informationsgesprächen und Beratungsterminen. Um diesen Prozess zu vereinfachen, soll eine mobile Anwendung die Kommunikation zwischen Ärzten und ihren Patienten erleichtern und beschleunigen. Dafür sollen Informationstexte und -videos bereitgestellt werden, die direkt auf den Einzelfall des Patienten eingehen. Die meisten Menschen besitzen bereits ein Smartphone, daher wären für den Einsatz der App keine weiteren Vorraussetzungen zu erfüllen.

<br><br>

#### Funktionen

Funktion | Beschreibung
--- | ---
_Benutzer- / Rollenverwaltung_ | Sowohl Ärzte als auch Patienten können sich in der App anmelden. Je nach Benutzergruppe stehen ihnen verschieden Funktionen zur Verfügung, wie die administrative Verwaltung von Fragen. Auch eine Authentisierung beim Starten der App muss erfolgen.
_Videobotschaften (Videoplattform)_ | Verschieden Informationsvideos sollen von Ärzten direkt erstellt und versendet werden können. Diese stehen zur Aufklärung für alle Nutzer zur Verfügung.
_Frage- und Antwortforum_ | Nutzer können medizinische Fragen über ein Forum stellen. Diese werden von Ärzten des Uni-Klinikums beantwortet. Außerdem ist eine Suchfunktion für bereits gestellte ähnliche Fragen verfügbar. Diese lassen sich mithilfe von `Tags` klassifizieren.
_Patientendatei (Patiententagebuch)_ | Patienten sind in der Lage Informationen in ein Profil einzutragen, welches mit Ärzten geteilt werden kann. Neben desundheitlichen/körperlichen Angaben können auch Verläufe von Krankheiten oder Genesungen dokumentiert werden.

Zusätzlich zu den genannten Funktionen stehen weiter Features im Backlog, die bei frühzeitigem Erreichen der Ziele ebenfalls umgesetzt werden können. Dazu zählt eine direkte und private Nachrichtenkommunikation mit Ärzten sowie eine Kalendarimplementierung, die eine eine selbständige Terminplanung von Patienten erlaubt.

#### Technologien

Die Applikation wird mit **Cordova** entwickelt. Dieses Framework zur Entwicklung hybrider Mobilanwednungen stellt eine plattformübergreifende Funktionalität sicher. Als grafische Oberfläche verwenden wir **Ionic**.

Für die mobile App werden folgende Funktionen eingebaut:
-   **Gerätefunktionen für Authentisierung** - Login mit Fingerabdruck oder Gesichtserkennung (Falls verfügbar)
-   **Location Service** - Zu bestimmung der Position eines Benutzers
-   **Push-Benachrichtigung** - Bei erhalt von Informationen oder anderen Ereignissen


Für den notwendigen Backend-Server (**Node.js** mit **MongoDB** als Datenbank) werden (vorraussichtlich) folgende Plugins verwendet:
-   **Passport** - Authentisierungs-Plugin ([Link](http://www.passportjs.org/))
-   **Mongoose** - Kommunikation mit MongoDB ([Link](http://mongoosejs.com/))
-   **accesscontrol** - Rollenverwaltung auf dem Server ([Link](https://www.npmjs.com/package/accesscontrol))

Die beiden Listen ist _nicht_ vollständig und kann im Laufe der Entwicklung kontinuierlich erweitert werden.

***

## Das Team
Unser Team besteht aus vier Studenten des Kurses WWI15SEB der DHBW Mannheim. Unterstützt werden wir von Dr. med. Giovanni Frongia an dem Universitätsklinikum Heidelberg sowie unserem Dozenten Prof. Dr.-Ing. habil. Dennis Pfisterer.

Mitglieder:
-   Steven Dal Pra (SAP)
-   Anne Hänzka (SAP)
-   Philipp Pinkernelle (SAP)
-   Philipp Reichel (SAP)

Kontakt per Mail: [ma_projekt@icloud.com](mailto:ma_projekt@icloud.com)

#### Timeline

-   _02. Februar_ : Konzeptbesprechung mit Dr. Frongia
-   _09. Februar_ : Brainstorm für Entwicklungsstack
-   _18. April_ : Kick-Off-Meeting für Entwicklung
-   _Ende Mai_ : Mock-ups und Server-Kommunikation fertig
-   _Ende Juni_: Erster Prototyp für mobile Applikation fertig
-   _Bis Ende Juli_: Feature-Implementierung
-  **_Anfang August_**: Vorraussichtliches Ende des Projekts für die DHBW


<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.

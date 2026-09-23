# Cross-user Analysis: praktijktest en verbeterplan

Getest op 11 september 2026 in de lokale OMERO op localhost:4080, via Chrome en aanvullende geauthenticeerde API-verzoeken. Er zijn geen applicatiecodewijzigingen of groepsrechtenwijzigingen uitgevoerd. Testaccounts: user1 (136), user2 (137), TestGroup (114).

## Conclusie

Beide gebruikers kunnen elkaars meetbestand analyseren. Beide kruislingse notebookruns zijn in Chrome voltooid, met CSV-output en automatische synchronisatie naar de eigen workspace. De bronplaat blijft echter niet ongewijzigd: Analysis schrijft verwijzingen en notebooks op de bron; de actie voor het bewaren van queryresultaten schrijft daar ook CSV en provenance. Dit is toegestaan door de huidige groepsrechten, maar maakt persoonlijke analyse onnodig afhankelijk van annotatierechten en vermengt brondata met werk van andere gebruikers.

## Testopstelling en bewijs

De opnieuw geüploade bron is gecontroleerd vóór de uitvoering:

| Bron | Eigenaar | Bestandsannotatie | OriginalFile |
|---|---|---|---|
| User1-Cells (Screen 202), Plate 302 | user1 | 4050 | 9052 |
| User2-Cells (Screen 203), Plate 303 | user2 | 4052 | 9053 |

Beide bestanden heten measurements.duckdb en zijn 6.828.032 bytes groot. De bestanden worden dus niet meer via dezelfde bestandsannotatie gedeeld. De importmetadata 4049 en 4051 waren al aanwezig.

Het meegeleverde [testnotebook](cross-user-analysis-test.ipynb) leest de tabelnamen, telt de rijen per basistabel via `ctx.query` en schrijft `cross-user-table-counts.csv`. Geen AI-provider is aangeroepen. Het resultaat bevat channels=3, images=1, intensity_measurements=519, label_sets=4, measurement_runs=1, objects=173, relationships=452 en schema_info=4. Dit zijn tellingen uit het meetbestand, niet van alle OMERO-afbeeldingen op de plaat.

| Test | Resultaat |
|---|---|
| user2 analyseert user1/Plate 302 in Chrome | Notebook voltooid; resultaat automatisch opgeslagen in Dataset 677, eigenaar user2; resultaatannotatie 4121 ook van user2 |
| user1 analyseert user2/Plate 303 in Chrome | Notebook voltooid; resultaat automatisch opgeslagen in Dataset 681, eigenaar user1; resultaatannotatie 4104 ook van user1 |
| Heropenen user1-workspace | Na verversen bleven eigen workspace, notebook en resultaat aanwezig |
| Heropenen user2-workspace na uitloggen/inloggen | Eigen workspace en notebook teruggevonden; volledige herhaalde run geslaagd; CSV en notebookoutput bleven na opnieuw verversen aanwezig |
| API-queries en CSV-download, beide users × beide platen | Alle vier HTTP 200, telkens objects=173, images=1, intensity_measurements=519 |
| Queryresultaat bewaren op andermans plaat | Beide richtingen HTTP 200; CSV plus provenance op bronplaat |
| Dezelfde bewaaractie herhalen | Beide richtingen `reused=true`, geen tweede set aangemaakt |
| user1 gebruikt contexttoken van user2 | HTTP 403 |
| Workspacebibliotheek bij accountwissel | user1 zag geen user2-workspaces als eigen hervatbare bibliotheek; eigen Dataset 681 werd aangemaakt |
| Bestaande regressietests | 65 geslaagd: workspace_sync, workspace_lifecycle en data_query_provenance |

De eerste user2-runs (ook een controle op eigen Plate 303) zijn handmatig gestopt terwijl de UI nog “Preparing” toonde. Dat is geen bewezen deadlock of rechtenfout. Een latere user1-run voltooide in circa 40 seconden en de user2-run voltooide ook toen deze langer mocht doorlopen. De voorbereidingsmelding geeft onvoldoende zicht op de feitelijke voortgang. De eigen-data browsercontrole is niet opnieuw tot voltooiing uitgevoerd; de eigen-data API-tests wel.

API-resultaten en object-ID's staan in [het JSON-testverslag](cross-user-analysis-2026-09-11.json). Daarin staan geen wachtwoorden, sessies of contexttokens.

## Geconstateerde neveneffecten

- Plate 302 kreeg van user2 source-link 4061 en notebook 4065. De aanvullende bewaaractie maakte resultaat 4111 en provenance 4112/4113 op die plaat.
- Plate 303 kreeg voor user2's controletest source-link 4084 en notebook 4087. De kruislingse user1-test voegde source-link 4100 toe; de bewaaractie resultaat 4108 en provenance 4109/4110.
- Het notebook op Plate 303 werd automatisch meegenomen in user1's nieuwe workspace, hoewel user1 alleen het meetbestand had geselecteerd. Het liep niet automatisch, maar analyses van de ene gebruiker verschijnen zo wel bij de andere.
- De eigen workspace-Datasets en gesynchroniseerde resultaatbestanden hebben de juiste eigenaar. “Eigen workspace” betekent niet automatisch privé: de objecten staan in de gedeelde TestGroup en blijven onder de OMERO-groepsrechten vallen.
- De oorspronkelijke import- en meetbestandsannotaties zijn nog aanwezig. De test heeft geen bronafbeeldingen bewerkt of verwijderd.

Oorzaken in de code: `workspace_sync` gebruikt `can_annotate(source)` voor status/plan/apply en schrijft een `source-link`. Notebookupload in `App.tsx` roept direct de brongebonden upload aan. `services._upload_annotation` en `data_query_provenance.promote_result` koppelen nieuwe annotaties aan de geselecteerde bron. Contexttokens en workspace-lifecycle gebruiken eveneens bronannotatierechten als voorwaarde voor eigen opslag/beheer.

## Implementatieplan

### 1. Eigendom en rechten loskoppelen

Normaal analyseren houdt de bron ongewijzigd. Opslag gaat naar de ingelogde gebruiker binnen dezelfde groep; er komt geen keuze voor een andere eigenaar of andere groep in deze wijziging. De server bepaalt de bestemming uit gebruiker, groep en workspace-ID, nooit uit een vrij opgegeven Dataset-ID.

Introduceer gedeelde controles voor bronlezen en workspacebeheer. Het lezen/bevragen van bronbestanden vereist leesrechten. Eigen workspaces aanmaken en synchroniseren vereist actuele groepslidmaatschap en aanmaakrechten in die groep; updates vereisen bovendien eigendom van de beheerde workspace. Bronannotatierechten zijn daarvoor niet nodig. Controleer rechten opnieuw vóór schrijven en download, zodat ingetrokken toegang niet via een oud token doorwerkt.

Maak capabilities voor `can_read_source`, `can_manage_workspace` en `can_annotate_source` afzonderlijk beschikbaar. Behoud het bestaande `can_annotate` veld met zijn huidige betekenis voor compatibiliteit. Geef sync-operaties in contexttokens vrij op basis van eigen workspacebeheer; directe bronupload blijft een afzonderlijke capability.

### 2. Alle analyseartefacten naar eigen workspace

Gebruik één server-side resolver voor het eigen beheerde Project/Dataset. Voeg een workspacegebonden uploadroute toe voor notebooks, methods, pipelines en snapshots; de frontend gebruikt deze route of lokale opslag gevolgd door workspace-sync. De route ontvangt workspace-ID, artefactsoort en bestand; de server valideert broncontext, eigenaar en groep. Falen van opslag mag niet terugvallen op upload naar de bron.

Stop automatische `source-link`-annotaties op de bron. Bewaar bron-ID, type, eigenaar, groep en beschikbare bronrevisie/checksum in het eigen manifest en de provenance. De bestaande eigen bibliotheek en Dataset-marker kunnen de bronrelatie leveren; hervatten hoeft geen backlink op de plaat te vereisen.

Laat de huidige query-resultaatbewaaractie expliciet “Bewaar in mijn workspace” worden. Voeg workspace-ID toe aan het verzoek en bind de idempotentiesleutel aan gebruiker, groep, workspace en receipt. CSV, provenance en completion-marker krijgen dezelfde eigen bestemming. Behoud de oude brongebonden API voor bestaande clients, maar roep deze niet meer impliciet aan vanuit de normale Analysis-workflow. Een afzonderlijke publiceerfunctie naar de bron valt buiten deze wijziging.

### 3. Voorspelbaar openen, beheren en hergebruiken

Een nieuwe workspace importeert alleen geselecteerde invoer. Notebooks/methods/pipelines die op de bron staan worden niet automatisch in de eigen workspace opgenomen; bied ze als expliciet te importeren items aan, met eigenaar en herkomst zichtbaar. Bestaande snapshots blijven hun opgeslagen inhoud herstellen.

Toon bron en bestemming naast elkaar, bijvoorbeeld “Bron: user1 / Plate 302” en “Workspace: user2 / TestGroup”. Vermijd het woord privé voor opslag in een gedeelde groep. Verplaatsen naar prullenbak, herstellen en opruimen controleren het eigendom van de workspace, niet de annotatierechten op de bron. Bij verlies van bronleesrechten stopt nieuwe analyse; eigen workspacebeheer en bestaande outputs blijven bereikbaar voor zover hun eigen rechten dat toestaan.

Toon tijdens notebookuitvoering afzonderlijk runtime-initialisatie, bronvalidatie, query/celuitvoering en synchronisatie. Behoud Stop; voeg een duidelijke fout en veilige retry toe bij een echt overschreden fase-timeout. De huidige succesvolle runs rechtvaardigen geen conclusie dat de querybridge defect is.

### 4. Regressies, migratie en acceptatie

- Test beide eigenaren × beide bronnen met Read-Annotate én Read-Only. In Read-Only moet analyse plus eigen opslag slagen zonder annotatierechten op andermans bron. Een onleesbare/private bron moet worden geweigerd.
- Vergelijk bronmetadata en bestandschecksums vóór/na nieuwe workspace, upload, notebook/methodrun, sync, resultaatbewaring, heropenen, trash/restore en purge. Geen nieuwe bronlinks of wijzigingen in de normale workflow.
- Controleer eigendom van Project, Dataset, OriginalFile, FileAnnotation, MapAnnotation, manifest en resultaten. Andermans workspace-ID of token geeft een weigering; groepswisseling en ingetrokken lidmaatschap worden opnieuw gecontroleerd.
- Herhaal resultaatbewaring, sync-retries en onderbroken upload; geen duplicaten, ongekoppelde bestanden of bronfallback. Test ook verschillende workspaces met dezelfde queryreceipt.
- Voer hetzelfde notebook uit in ingebedde en zelfstandige Chrome-weergave, met koude en warme runtime. Vergelijk CSV-inhoud, controleer opslag, logout/login en hervatten vanuit de eigen bibliotheek.
- Lees oudere manifests/source-links compatibel. Verwijder bestaande bronannotaties niet automatisch bij een upgrade. Eventuele opruiming gebeurt via een aparte exacte inventaris, nadat de eigen kopie en herkomst zijn gecontroleerd; nooit via brede namespace/prefix-verwijdering.
- Rol eerst lokaal uit, voer bovenstaande acceptatiematrix uit en rapporteer eigenaar/bestemming en bron-delta per scenario. Geen release/publicatie als onderdeel van dit plan.

## Grenzen en achtergelaten testdata

Live getest: bestaande TestGroup, twee meetbestanden, notebook-CSV en querybewaring. Geen live wijziging naar Read-Only/Private, geen AI-analyse, geen beeldresultaatimport en geen volledige browser-lifecycle/purge-test. De Read-Only-beperking volgt momenteel uit de expliciete codecontroles en moet in de implementatieacceptatie live worden afgedekt.

De drie testworkspaces (Datasets 677, 678 en 681) en bovengenoemde testannotaties zijn behouden voor inspectie. Door het huidige productgedrag werden ook eigen settingscontainers aangemaakt. De tijdelijk ingeschakelde artifact editor voor user2 is teruggezet naar uit. Chrome is weer ingelogd als user2, met het opgeslagen notebookresultaat open. Er is geen functionele fix toegepast; alleen testartefacten en dit verslag/plan zijn toegevoegd.

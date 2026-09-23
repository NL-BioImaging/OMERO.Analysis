# Cross-user Analysis: implementatie en acceptatie, 11 september 2026

De wijzigingen zijn geïmplementeerd op `analysis_integration`, gebouwd en in de lokale OMERO.web-container geladen. Er is geen release gepubliceerd of commit gemaakt.

## Gedrag

- Bronlezen, bronannoteren en eigen workspacebeheer hebben afzonderlijke capabilities. Synchronisatie en lifecycle vereisen actuele groepsrechten en de eigen beheerde bestemming; bronannotatierechten zijn daarvoor niet nodig.
- De server bepaalt de bestemming uit de actieve gebruiker, groep en workspace-ID. Een client kan geen willekeurig Dataset-ID als uploadbestemming kiezen. Bestaande workspaces kunnen niet via een andere broncontext worden overschreven.
- Notebookupload schrijft lokaal en wordt automatisch naar de eigen workspace gesynchroniseerd. De normale frontend-uploadmethoden voor resultaten, notebooks, pipelines en snapshots gebruiken een workspacegebonden route. Een uploadfout valt niet terug op de bron.
- Synchronisatie schrijft geen source-link meer op de bron. Bron-ID, type, eigenaar, groep en beschikbare revisie staan in het eigen manifest. Bestaande bronannotaties blijven intact.
- Bewaren van een geverifieerde query accepteert een workspace-ID. CSV, provenance en completion-marker krijgen dezelfde eigen bestemming; herhaling is idempotent per gebruiker/groep/workspace/receipt. Oude clients zonder workspace-ID houden hun expliciete brongebonden API.
- Nieuwe workspaces nemen geen bronnotebooks automatisch over. De importkeuze toont naam, eigenaar en annotatie-ID. Het notebook wordt pas uitgevoerd na Run.
- De interface toont bron/eigenaar en de eigen opslagbestemming. “Save to my workspace” vervangt de onduidelijke resultaatactie. Een gedeelde groep wordt niet als privé aangeduid; de oude standaardprojectomschrijving wordt bij synchronisatie bijgewerkt.
- Datasetgebonden lifecyclebeheer gebruikt een eigen capability. Het werkt ook wanneer de oorspronkelijke bron is verwijderd. Nieuwe queries blijven afhankelijk van de werkelijke leesbare bron.
- Notebookvoorbereiding toont afzonderlijke meldingen voor Python-start, broncontrole en inputbinding; cellen en synchronisatie hebben hun eigen voortgang. Bestaande cel- en querytime-outs en Stop blijven gelden. Er is geen nieuwe globale voorbereidingstime-out ingevoerd.

## Chrome-resultaten

| Test | Uitkomst |
|---|---|
| user2 → plaat 302 van user1, zelfstandige Analysis | Notebook voltooid, 3 cellen, CSV/PNG/SVG opgeslagen in Dataset 682 van user2 |
| user1 → plaat 303 van user2, ingebed in BIOMERO | Notebook voltooid, 3 cellen, CSV/PNG/SVG opgeslagen in Dataset 687 van user1 |
| Nieuwe workspace met bestaande notebookannotatie op de bron | Begint met 0 notebooks; bronnotebook alleen zichtbaar als importkeuze |
| Herhaalde ingebedde run onder Read-Only | Bron leesbaar, `canAnnotate=False`; eigen Dataset annotatable; run en sync geslaagd |
| Uitloggen/inloggen en user2-workspace heropenen | Notebook en resultaten teruggevonden; definitieve lokale build toont Saved automatically |
| CSV/PNG van beide gebruikers | Byte voor byte gelijk |

De eerste user2-plotimport had een OMERO ManagedRepository-race: één van twee gelijktijdige eerste imports meldde “Directory exists but is not registered”. Eén expliciete Retry voltooide de import; de geslaagde plot werd niet opnieuw geïmporteerd. De implementatie start nu één import over de workspaces van die gebruiker totdat een geïmporteerde plot aanwezig is. Daarna geldt de ingestelde paralleliteit. Dit eerste-importbeleid heeft een gerichte regressietest; een geheel nieuwe gebruiker is daarna niet opnieuw live aangemaakt.

## Wetenschappelijke inhoud

Het daadwerkelijke bestand bevat 1 afbeelding, 3 cellen, 3 nuclei, 3 cytoplasma-objecten en 164 spots. Alle objecttypen samen tellen 173; dat is geen celtelling. De analyse filtert `label_sets.object_type = 'cells'`, telt objecten en houdt run, labelset en tijdpunt afzonderlijk. Intensiteitsrijen worden niet als cellen geteld.

`images.plate_row`, `plate_column` en `field_index` zijn leeg. Daarom staat in de uitvoer **Well unknown: 3**. Er wordt geen koppeling aan A1/B1 afgeleid uit de naam van de OMERO-plaat. Het notebook groepeert wel op echte well-coördinaten wanneer die in de meetdatabase aanwezig zijn. CSV en plot zijn dus een echte test van analyse en opslag, geen onderbouwde verdeling over de fysieke wells A1/B1.

Het [notebook](cross-user-cells-per-well.ipynb), de [SQL](cells-per-well.sql), [CSV](cross-user-results/user2/cells-per-well.csv), [PNG](cross-user-results/user2/cells-per-well.png) en [SVG](cross-user-results/user2/cells-per-well.svg) zijn beschikbaar. De uitvoer is uit de werkelijk gesynchroniseerde bestanden geëxporteerd en tegen de manifestchecksums gecontroleerd.

## Backend-acceptatie

- Beide gebruikers × beide platen onder Read-Annotate én Read-Only: query, eigen workspace, CSV-bewaring, idempotente herhaling, trash en restore geslaagd (8 matrixgevallen; daarvoor 4 eerste RA-controles).
- Eigenaars van de wetenschappelijke workspace-Datasets, FileAnnotations, OriginalFiles en plot-Images zijn de uitvoerende gebruikers. De expliciete HTTP-upload gaf 201 en annotatie 4241, eigenaar user2, uitsluitend gekoppeld aan Dataset 682.
- Andermans workspace-ID wordt geweigerd. Groepsintrekking en de eerste-importbeperking hebben gerichte regressietests.
- Een afzonderlijke private groep liet de andere gewone groepsgebruiker de bron niet lezen. De test-Dataset en memberships zijn verwijderd. OMERO kon de lege groep niet verwijderen door één historische Event-FK; precies die Event, EventLog en groep 116 zijn lokaal transactioneel verwijderd. Geen testgroep achtergelaten.
- De bestaande TestGroup kon niet privé worden gemaakt wegens 9 oude PlateAnnotationLinks tussen eigenaren. Dit is geen nieuwe link-delta. De oorspronkelijke Read-Annotate-rechten (`rwra--`, -40) zijn hersteld.
- Een eigen testworkspace kon na verwijdering van zijn tijdelijke bron worden getrasht, hersteld en gepurged. De testworkspace-Dataset 698 is verwijderd.
- De oorspronkelijke platen 302/303 zijn vergeleken op annotatie-ID's, eigenaars, namespaces, mapwaarden en alle annotatiebestands-SHA256's: **geen verschil**. Oude neveneffecten van de eerdere verkennende tests zijn bewust niet automatisch verwijderd.

Bewijs: [rechtenmatrix](cross-user-workspace-permissions.json), [eerste RA-controle](cross-user-workspace-read-annotate.json), [grensgevallen](cross-user-workspace-edges.json), [HTTP-upload](cross-user-workspace-http.json), [bronvergelijking](cross-user-source-final.json), [resultaat-ID's en hashes](cross-user-results/evidence.json).

## Regressies en grenzen

177 backendtests geslaagd; 18 overgeslagen (Windows-symlinktest en opt-in worker-versiematrix). Na de laatste bronbindingscontrole zijn de 55 betrokken sync/lifecycle/viewtests opnieuw geslaagd. De volledige frontendronde had 243 geslaagde tests; daarna zijn 35 gerichte API/notebooktests inclusief één nieuwe uploadbestemmingstest geslaagd. TypeScript en de productiebuild slagen.

Live notebooktests gebruiken remote DuckDB-queries, geen AI-provider. Er is geen nieuwe method/pipeline met AI gegenereerd. De nieuwe generieke uploadroute is live getest met CSV; notebook/plots zijn live via workspace-sync getest. Bestaande outputs blijven via het eigen OMERO Dataset bereikbaar als de bron verdwijnt; een nieuwe analysegang vereist opnieuw bronleesrechten. Een volledig nieuwe browserstart zonder leesbare bron hervat niet automatisch het notebook.

De twee wetenschappelijke workspaces zijn behouden voor inspectie (682, 687). De kleine API-acceptatieworkspaces 683–686 en 688–695 bevatten de test-CSV/provenance en zijn eveneens behouden. Chrome staat weer op user2 met diens opgeslagen resultaat. De scripts `cross_user_workspace_probe.py` en `cross_user_workspace_edges.py` lezen credentials uitsluitend van stdin.

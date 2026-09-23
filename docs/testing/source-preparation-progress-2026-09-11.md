# Source preparation feedback

The workspace preparation screen now shows the source filename, bytes streamed
from OMERO.web towards DataQueryWorker, total size, transfer percentage and elapsed
time. Source lookup and database inspection use an indeterminate progress bar.
The transfer percentage describes this file's transfer, not overall workspace
completion. Local browser downloads also identify their filename and route.

Transfer status is short-lived and shared between OMERO.web processes. Every poll
rechecks source authorization; status is scoped to user/session/group/context,
source revision and a unique preparation request. Status failures do not fail the
analysis. Polling stops when schema preparation completes or fails. There is no
cancel button because the current synchronous transfer cannot reliably be
cancelled server-side by closing the browser request.

The source selection panel explains remote versus browser analysis and labels
each attachment's default route. An unavailable worker is explicitly identified.

Validation: 179 Python tests passed, 18 skipped (Windows symlink and opt-in worker
contract matrix); 22 frontend API tests passed; production TypeScript/Vite build
passed. Deployed to the local OMERO.web instance.

Chrome test as user2, Screen 204 / annotation 4245 (789.8 MiB), fresh login and
new workspace: remote route label visible; actual transfer advanced from 74.5 MiB
(9%, 6 seconds) to 117.7 MiB (15%, 9 seconds). Screenshot confirmed readable layout.

Further live observations: 425.1 MiB at 31 seconds; after the full 789.8 MiB
transfer, the UI changed to “Checking database on DataQueryWorker” at 58 seconds.

The source then became ready and the workspace opened successfully, with zero
pending imports. Existing analysis results were not rerun or modified for this UI test.

1. Open the Google Sheet:
   https://docs.google.com/spreadsheets/d/1qaDJTFaJL4WsSYCAkiRC_tRZ0LUqgHuVUeacyKUW3Nc/edit
2. Open Extensions > Apps Script.
3. Replace the script content with the code from google-apps-script/code.gs and save.
4. Select the `setup` function in the toolbar and click Run. Approve the permissions.
   This creates the "RSVP" and "Wishes" sheets with headers. (They are also created
   automatically on the first submission if you skip this step.)
5. Click Deploy > New deployment.
6. Select type: Web app.
7. Execute as: Me.
8. Who has access: Anyone.
9. Deploy and copy the Web App URL (ends with /exec).
10. Paste it into src/config.ts:

    export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';

11. Rebuild / redeploy the website.

Sheets created:
- RSVP: Timestamp | Full Name | Guests | Dietary Notes
- Wishes: Timestamp | Name | Message

Notes:
- If you change the Apps Script code later, use Deploy > Manage deployments > Edit >
  New version, so the Web App URL stays the same.

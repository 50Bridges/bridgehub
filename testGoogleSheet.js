// testGoogleSheet.js
const { google } = require('googleapis');

async function fetchAll() {
  try {
    // ✅ UPDATED: Use env variable instead of keyFile
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();

    // 2) Build the sheets client
    const sheets = google.sheets({ version: 'v4', auth: client });

    // ✅ UPDATED: New Google Sheet ID
    const spreadsheetId = '1skOm729OHp8jCWENGCgHFevQQXXyZmKWRWOYEJ1qu0k';

    // ⚠️ Preserved range exactly
    const range = 'Sheet1!A:P';

    // 3) Fetch data
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'FORMATTED_VALUE',
    });

    const values = resp.data.values || [];

    // 4) Log results
    console.log('✅ Fetched rows:', values.length);
    console.log('📊 Columns:', (values[0] || []).length);
    console.log(JSON.stringify(values, null, 2));

  } catch (err) {
    console.error('❌ Error fetching sheet:', err.message);
  }
}

fetchAll();
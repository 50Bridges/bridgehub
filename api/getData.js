import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // ✅ Use unified env variable name
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // ✅ Updated to your new Google Sheet
    const spreadsheetId = '1rqtmUhIxZiisR_3SHtlPjyPWH95upyyt';
    const range = 'Sheet1!A:Q';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'FORMATTED_VALUE',
    });

    const values = response.data.values || [];
    if (values.length < 2) {
      return res.status(404).json({ error: 'No data found.' });
    }

    return res.status(200).json(values);
  } catch (error) {
    console.error('❌ Google Sheets fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch sheet data.' });
  }
}
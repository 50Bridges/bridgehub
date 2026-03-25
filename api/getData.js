const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
      return res.status(500).json({ error: 'Missing GOOGLE_SERVICE_ACCOUNT_CREDENTIALS' });
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1rqtmUhIxZiisR_3SHtlPjyPWH95upyyt',
      range: 'Sheet1!A:Q',
      valueRenderOption: 'FORMATTED_VALUE',
    });

    return res.status(200).json(response.data.values || []);
  } catch (error) {
    console.error('❌ Google Sheets fetch error:', error);
    return res.status(500).json({
      error: error.message,
      details: error.errors || null,
    });
  }
};
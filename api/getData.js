const { google } = require('googleapis');

module.exports = async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
      return res.status(500).json({
        step: 'env-check',
        error: 'Missing GOOGLE_SERVICE_ACCOUNT_CREDENTIALS'
      });
    }

    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    } catch (e) {
      return res.status(500).json({
        step: 'json-parse',
        error: e.message
      });
    }

    if (!credentials.client_email || !credentials.private_key) {
      return res.status(500).json({
        step: 'credentials-shape',
        error: 'client_email or private_key missing',
        hasClientEmail: !!credentials.client_email,
        hasPrivateKey: !!credentials.private_key
      });
    }

    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    let client;
    try {
      client = await auth.getClient();
    } catch (e) {
      return res.status(500).json({
        step: 'auth-getClient',
        error: e.message
      });
    }

    const sheets = google.sheets({ version: 'v4', auth: client });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: '1rqtmUhIxZiisR_3SHtlPjyPWH95upyyt',
        range: 'Sheet1!A:Q',
        valueRenderOption: 'FORMATTED_VALUE',
      });

      return res.status(200).json({
        step: 'success',
        rows: (response.data.values || []).length,
        values: response.data.values || []
      });
    } catch (e) {
      return res.status(500).json({
        step: 'sheets-values-get',
        error: e.message,
        details: e.errors || null,
        code: e.code || null
      });
    }

  } catch (error) {
    return res.status(500).json({
      step: 'outer-catch',
      error: error.message,
      stack: error.stack
    });
  }
};
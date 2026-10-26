const SPREADSHEET_ID = '1qaDJTFaJL4WsSYCAkiRC_tRZ0LUqgHuVUeacyKUW3Nc';

// Each sheet is created automatically (with headers) the first time it is needed.
const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Guests', 'Dietary Notes'],
    toRow: function (p) {
      return [new Date(), clean_(p.fullName), clean_(p.guests), clean_(p.dietaryNotes)];
    },
  },
  WISH: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Message'],
    toRow: function (p) {
      return [new Date(), clean_(p.name), clean_(p.message)];
    },
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const payload = parsePayload_(e);
    const config = SHEETS[String(payload.sheet || '').toUpperCase()];

    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, config);
    sheet.appendRow(config.toRow(payload));

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wedding form endpoint is running.',
  });
}

// Run this once from the Apps Script editor to create both sheets and grant permissions.
function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (key) {
    getOrCreateSheet_(ss, SHEETS[key]);
  });
}

function getOrCreateSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    sheet.getRange(1, 1, 1, config.headers.length)
      .setFontWeight('bold')
      .setBackground('#f3e8e2');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sheet.autoResizeColumns(1, config.headers.length);
  }
  return sheet;
}

// Prevent values starting with = + - @ being run as spreadsheet formulas.
function clean_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) {
    return {};
  }

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

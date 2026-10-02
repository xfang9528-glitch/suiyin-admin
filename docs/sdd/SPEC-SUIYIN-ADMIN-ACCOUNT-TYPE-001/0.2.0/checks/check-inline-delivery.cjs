'use strict';
// Release checks for this page only. Reads the already-public Mock, never raw captures.
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }

const origin = process.env.ADMIN_PREVIEW_ORIGIN || 'http://127.0.0.1:5200';
const prototypeRoot = process.env.ADMIN_PROTOTYPE_ROOT || path.resolve(__dirname, '../../../佰智德三/碎银原型/suiyin-admin/prototype');
const query = '?tenant=bzds&page=allWeChatStatus';
const entries = [
  {kind: 'http-shell', url: origin + '/prototype/_shell.html' + query},
  {kind: 'http-inline', url: origin + '/prototype/_shell_inline.html' + query},
  {kind: 'file-inline', url: pathToFileURL(path.join(prototypeRoot, '_shell_inline.html')).href + query},
];
const expected = {environments: 43, accounts: 1139, online: 799, offline: 340, wx: [970, 748, 222], qw: [169, 51, 118], proxyCards: 118};
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function assertAccountRows(frame, source, orderedRows = source.wechat) {
  const displayed = await frame.locator('.account-status-table tbody tr').evaluateAll(rows => rows.map(row => ({
    environment: row.cells[0].innerText,
    statistics: Object.fromEntries([...row.cells[1].querySelectorAll('[data-account-type]')].map(line => [line.dataset.accountType,
      [...line.querySelectorAll('.account-status-badge')].map(badge => Number(badge.textContent))])),
    groups: [2, 3].map(index => Object.fromEntries([...row.cells[index].querySelectorAll('.account-status-account-group')].map(group => [
      group.dataset.accountType, [...group.querySelectorAll('.account-status-badge')].map(badge => badge.textContent)]))),
  })));
  assert.equal(displayed.length, expected.environments);
  for (let i = 0; i < orderedRows.length; i++) {
    const row = orderedRows[i], actual = displayed[i];
    assert.equal(actual.environment, row.environment);
    assert.deepEqual(Object.keys(actual.statistics), ['wx', 'qw', 'total']);
    assert.deepEqual(actual.statistics.total, row.counts);
    for (const type of ['wx', 'qw']) {
      const online = row.online.filter((name, index) => row.accountTypes.online[index] === type);
      const offline = row.offline.filter((name, index) => row.accountTypes.offline[index] === type);
      assert.deepEqual(actual.statistics[type], [online.length + offline.length, online.length, offline.length]);
      assert.deepEqual(actual.groups[0][type], online);
      assert.deepEqual(actual.groups[1][type], offline);
    }
    assert.deepEqual(Object.keys(actual.groups[0]), ['wx', 'qw']);
    assert.deepEqual(Object.keys(actual.groups[1]), ['wx', 'qw']);
  }
  assert.doesNotMatch(await frame.locator('.account-status-live').innerText(), /待核对|已核实|演示工作账号|采集缺口/);
}

async function verifyEntry(browser, entry) {
  const context = await browser.newContext({viewport: {width: 1440, height: 1000}, serviceWorkers: 'block'});
  const externalRequests = [], pageErrors = [], consoleErrors = [], protocols = {};
  try {
    const allowed = url => entry.kind === 'file-inline'
      ? /^(file:|data:|about:)/.test(url)
      : url.startsWith(origin + '/') || /^(data:|about:)/.test(url);
    await context.route('**/*', route => {
      const url = route.request().url();
      if (allowed(url)) return route.continue();
      externalRequests.push(url.split('?')[0]);
      return route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('request', request => { const protocol = request.url().split(':')[0]; protocols[protocol] = (protocols[protocol] || 0) + 1; });
    await page.goto(entry.url);
    await page.frameLocator('iframe').locator('.account-status-table tbody tr').last().waitFor();
    const frame = page.frames().find(frame => frame.parentFrame() === page.mainFrame());
    assert(frame, 'Expected the content iframe');
    const source = await frame.evaluate(() => structuredClone(window.AdminAllAccountStatusData));
    assert.equal(source.wechat.length, expected.environments);
    assert.equal(source.proxy.length, expected.proxyCards);
    assert.deepEqual(source.wechat.reduce((sum, row) => sum.map((value, index) => value + row.counts[index]), [0, 0, 0]), [expected.accounts, expected.online, expected.offline]);
    const categoryCounts = {};
    for (const type of ['wx', 'qw']) {
      const online = source.wechat.reduce((sum, row) => sum + row.accountTypes.online.filter(value => value === type).length, 0);
      const offline = source.wechat.reduce((sum, row) => sum + row.accountTypes.offline.filter(value => value === type).length, 0);
      categoryCounts[type] = [online + offline, online, offline];
      assert.deepEqual(categoryCounts[type], expected[type]);
    }
    assert(!/1[3-9]\d{9}/.test(JSON.stringify(source)), 'Public entry contains a full mobile number');
    assert(!source.wechat.some(row => row.typeEvidence || row.statusSnapshotEvidence), 'Internal metadata leaked into a public entry');
    assert.equal((await frame.evaluate(() => AdminAllAccountStatus.validateData())).valid, true);
    await assertAccountRows(frame, source);

    const ordered = direction => source.wechat.map((row, index) => ({row, index})).sort((a, b) =>
      (a.row.environment < b.row.environment ? -1 : a.row.environment > b.row.environment ? 1 : 0) * direction || a.index - b.index).map(item => item.row);
    await frame.locator('.account-status-sort').click();
    await assertAccountRows(frame, source, ordered(1));
    assert.equal(await frame.locator('.account-status-table thead th').first().getAttribute('aria-sort'), 'ascending');
    await frame.locator('.account-status-table-scroll').evaluate(element => { element.scrollTop = 600; });
    const previousScroll = await frame.locator('.account-status-table-scroll').evaluate(element => element.scrollTop);
    await frame.getByRole('tab', {name: '代理账号', exact: true}).click();
    const proxies = await frame.locator('.account-status-proxy-card').evaluateAll(cards => cards.map(card => ({
      name: card.querySelector('.account-status-proxy-name').textContent,
      online: Number(card.querySelectorAll('.account-status-proxy-count span')[0].textContent),
      offline: Number(card.querySelectorAll('.account-status-proxy-count span')[1].textContent),
    })));
    assert.deepEqual(proxies, source.proxy);
    await frame.getByRole('tab', {name: '微信账号', exact: true}).click();
    await assertAccountRows(frame, source, ordered(1));
    assert.equal(await frame.locator('.account-status-table-scroll').evaluate(element => element.scrollTop), previousScroll);
    await frame.locator('.account-status-sort').click();
    await assertAccountRows(frame, source, ordered(-1));
    await frame.locator('.account-status-sort').click();
    await assertAccountRows(frame, source);
    assert.equal(await frame.locator('.account-status-table thead th').first().getAttribute('aria-sort'), 'none');
    assert.deepEqual(pageErrors, []); assert.deepEqual(consoleErrors, []); assert.deepEqual(externalRequests, []);
    return {entry: entry.kind, passed: true, environments: source.wechat.length, accounts: expected.accounts,
      aggregateCounts: [expected.accounts, expected.online, expected.offline], categoryCounts, proxyCards: proxies.length,
      verified: ['all row totals and wx/qw lists including repeated names', 'no third business category', 'three sorting states and original-order reset',
        '118 exact proxy cards', 'tab switch preserves sorted list and scroll', 'no legacy fallback', 'public masking and metadata boundary'],
      requestProtocols: protocols, externalRequests, pageErrors, consoleErrors};
  } finally { await context.close(); }
}

(async () => {
  const browser = await playwright.chromium.launch({channel: 'chrome', headless: true});
  const results = [];
  try { for (const entry of entries) results.push(await verifyEntry(browser, entry)); }
  finally { await browser.close(); }
  const report = {verifiedAt: new Date().toISOString(), scope: 'Only the allWeChatStatus page and its public local data', expected,
    artifactHashes: {inlineSha256: sha256(path.join(prototypeRoot, '_shell_inline.html')), dataSha256: sha256(path.join(prototypeRoot, 'data/all-account-status.js'))},
    passed: results.length === entries.length, results};
  fs.writeFileSync(path.join(__dirname, 'inline-delivery-verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({passed: report.passed, entryCount: results.length, entries: results.map(result => result.entry), expected, artifactHashes: report.artifactHashes}, null, 2));
})().catch(error => {console.error(error); process.exitCode = 1;});

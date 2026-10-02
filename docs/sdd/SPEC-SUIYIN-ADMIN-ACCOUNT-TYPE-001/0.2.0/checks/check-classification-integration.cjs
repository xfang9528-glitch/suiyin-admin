'use strict';

// Integration regression with synthetic fixtures only. The account data script
// is intercepted inside an isolated headless context; no source file is changed.
const {chromium} = require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = 'http://127.0.0.1:5200';
const goodData = {
  tenant: 'bzds',
  wechat: [
    {environment: 'EMPTY_FIXTURE', counts: [0, 0, 0], online: [], offline: []},
    {environment: 'MIXED_FIXTURE', counts: [4, 2, 2], online: ['duplicate', 'duplicate'], offline: ['duplicate', 'duplicate'], accountTypes: {online: ['wx', 'qw'], offline: ['qw', 'wx']}},
    {
      environment: 'LONG_FIXTURE', counts: [240, 120, 120],
      online: Array.from({length: 120}, (_, i) => 'ONLINE-' + i + '-LongLabel'.repeat(4)),
      offline: Array.from({length: 120}, (_, i) => 'OFFLINE-' + i + '-LongLabel'.repeat(4)),
      accountTypes: {
        online: Array.from({length: 120}, (_, i) => i < 60 ? 'wx' : 'qw'),
        offline: Array.from({length: 120}, (_, i) => i < 60 ? 'wx' : 'qw'),
      },
    },
  ],
  proxy: [{name: 'FIXTURE_PROXY', online: 1, offline: 0}],
};
const invalidRow = {environment: 'INVALID_FIXTURE', counts: [1, 1, 0], online: ['preserve-me'], offline: []};

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const passed = [], pageErrors = [], externalRequests = [];
  const openFixture = async initialData => {
    let suppliedData = initialData;
    const context = await browser.newContext({viewport: {width: 1024, height: 768}, serviceWorkers: 'block'});
    await context.route('**/*', route => {
      const url = route.request().url();
      if (!url.startsWith(origin + '/')) {
        externalRequests.push(url);
        return route.abort('blockedbyclient');
      }
      if (url === origin + '/prototype/data/all-account-status.js') {
        return route.fulfill({status: 200, contentType: 'application/javascript', body: 'window.AdminAllAccountStatusData=' + JSON.stringify(suppliedData) + ';'});
      }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(origin + '/prototype/admin-content.html?tenant=bzds&route=allWeChatStatus');
    await page.waitForFunction(() => document.querySelector('.account-status-live,[data-account-status-error]'));
    return {page, replaceFixture: data => { suppliedData = data; }};
  };
  try {
    const {page} = await openFixture(goodData);
    const summaries = await page.locator('.account-status-table tbody tr').evaluateAll(rows => rows.slice(0, 2).map(row => ({
      counts: Object.fromEntries([...row.cells[1].querySelectorAll('[data-account-type]')].map(element => [element.dataset.accountType, [...element.querySelectorAll('.account-status-badge')].map(badge => badge.textContent)])),
      sides: [2, 3].map(column => [...row.cells[column].querySelectorAll('.account-status-account-group')].map(group => ({
        type: group.dataset.accountType,
        quantity: group.querySelector('.account-status-group-count').textContent,
        names: [...group.querySelectorAll('.account-status-badge')].map(badge => badge.textContent),
      }))),
    })));
    assert.deepEqual(summaries[0].counts, {wx: ['0', '0', '0'], qw: ['0', '0', '0'], total: ['0', '0', '0']});
    assert.equal(await page.locator('.account-status-table tbody tr').first().locator('.account-status-empty-group').count(), 4);
    passed.push('Empty environments render both zero-valued types without requiring absent accountTypes arrays');
    assert.deepEqual(summaries[1].counts, {wx: ['2', '1', '1'], qw: ['2', '1', '1'], total: ['4', '2', '2']});
    for (const side of summaries[1].sides) {
      assert.deepEqual(side.map(group => group.type), ['wx', 'qw']);
      assert.deepEqual(side.map(group => group.quantity), ['1', '1']);
      assert.deepEqual(side.flatMap(group => group.names), ['duplicate', 'duplicate']);
    }
    passed.push('Same-name wx/qw entries remain separate in both online and offline columns, with matching counts');

    const malformedCounts = await page.evaluate(() => [[1, 1], [1, 1, 0, 0], [-1, 0, 0], [1.5, 1, 0], ['1', 1, 0], [NaN, 1, 0], [Infinity, 1, 0], Array(3)].map(counts => AdminAllAccountStatus.validateData({wechat: [{environment: 'BAD', counts, online: [], offline: []}]}).valid));
    assert.ok(malformedCounts.every(valid => valid === false));
    passed.push('Invalid count shapes, negative/fractional/string/nonfinite values and sparse arrays fail developer validation');

    const sticky = [];
    for (const type of ['wx', 'qw']) {
      await page.locator('.account-status-table-scroll').evaluate((wrap, type) => {
        const heading = wrap.querySelector(`tbody tr:nth-child(3) td:nth-child(3) [data-account-type="${type}"] .account-status-group-heading`);
        wrap.scrollTop += heading.getBoundingClientRect().top - wrap.getBoundingClientRect().top + 100;
      }, type);
      await page.waitForTimeout(100);
      const geometry = await page.evaluate(type => {
        const header = document.querySelector('.account-status-table thead').getBoundingClientRect();
        const heading = document.querySelector(`tbody tr:nth-child(3) td:nth-child(3) [data-account-type="${type}"] .account-status-group-heading`).getBoundingClientRect();
        return {type, headerTop: header.top, headerBottom: header.bottom, groupTop: heading.top};
      }, type);
      sticky.push(geometry);
      assert.ok(Math.abs(geometry.groupTop - geometry.headerBottom) < 1);
    }
    assert.ok(Math.abs(sticky[0].headerTop - sticky[1].headerTop) < 1);
    passed.push('Both long-list group headings stick immediately below the shared table header without overlap');

    await page.locator('.account-status-table-scroll').evaluate(element => { element.scrollTop = 200; });
    const redraw = await page.evaluate(row => {
      const previous = document.querySelector('.account-status-live');
      const text = previous.textContent;
      AdminAllAccountStatusData.wechat = [row];
      return {
        handled: AdminViews.render(),
        sameNode: previous === document.querySelector('.account-status-live'),
        sameText: text === previous.textContent,
        scrollTop: document.querySelector('.account-status-table-scroll').scrollTop,
        legacy: !!document.querySelector('.source-account-tabs'),
      };
    }, invalidRow);
    assert.deepEqual(redraw, {handled: true, sameNode: true, sameText: true, scrollTop: 200, legacy: false});
    await page.getByRole('tab', {name: '代理账号', exact: true}).click();
    assert.equal(await page.locator('.account-status-proxy-card').count(), 1);
    await page.getByRole('tab', {name: '微信账号', exact: true}).click();
    assert.equal(await page.locator('.account-status-table tbody tr').count(), 3);
    assert.equal(await page.locator('.account-status-table-scroll').evaluate(element => element.scrollTop), 200);
    await page.locator('.account-status-sort').click();
    assert.equal(await page.locator('.account-status-table tbody tr').count(), 3);
    passed.push('Failed parent redraw keeps the valid DOM, scroll position and usable tab/sort snapshot instead of legacy data');

    const failed = await openFixture({...goodData, wechat: [invalidRow]});
    assert.equal(await failed.page.locator('[data-account-status-error]').count(), 1);
    assert.equal(await failed.page.locator('.source-account-tabs,.table-wrap,.account-status-table').count(), 0);
    const errorText = await failed.page.locator('#app').innerText();
    assert.match(errorText, /页面读取失败/);
    assert.doesNotMatch(errorText, /待核对|已核实|采集|演示工作账号/);
    failed.replaceFixture(goodData);
    await Promise.all([failed.page.waitForNavigation(), failed.page.getByRole('button', {name: '重试', exact: true}).click()]);
    await failed.page.locator('.account-status-table tbody tr').last().waitFor();
    assert.equal(await failed.page.locator('.account-status-table tbody tr').count(), 3);
    assert.equal(await failed.page.locator('[data-account-status-error]').count(), 0);
    passed.push('Invalid initial fixture shows only the existing read-failure/retry UI; retry restores complete fixture with no legacy rows');

    const missing = await openFixture(null);
    assert.equal(await missing.page.locator('[data-account-status-error]').count(), 1);
    assert.equal(await missing.page.locator('.source-account-tabs,.table-wrap').count(), 0);
    passed.push('Missing initial account-status data also stays in the dedicated route and never falls back to legacy rows');

    const otherTenant = await failed.page.evaluate(() => {
      const previousTenant = Admin.tenant;
      const originalRender = Admin.renderTablePage;
      let calls = 0;
      Admin.tenant = 'OTHER_TENANT_FIXTURE';
      Admin.renderTablePage = (...args) => { calls++; return originalRender(...args); };
      try { return {handled: AdminViews.render(), legacyCalls: calls, legacyTabs: !!document.querySelector('.source-account-tabs')}; }
      finally { Admin.tenant = previousTenant; Admin.renderTablePage = originalRender; }
    });
    assert.deepEqual(otherTenant, {handled: true, legacyCalls: 1, legacyTabs: true});
    passed.push('The existing non-bzds fallback remains unchanged');
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(externalRequests, []);
    const report = {verifiedAt: new Date().toISOString(), isolatedFixturesOnly: true, sourceDataModified: false, passed, sticky, pageErrors, externalRequests};
    fs.writeFileSync(path.join(__dirname, 'component-integration-verification.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({passed: passed.length, results: passed, sticky}, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });

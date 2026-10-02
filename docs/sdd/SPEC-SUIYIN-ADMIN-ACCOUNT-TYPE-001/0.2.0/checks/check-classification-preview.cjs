'use strict';

// Local static-prototype regression checks. Fixtures exist only in the isolated
// headless page; the source snapshot and prototype data files are never changed.
const {chromium} = require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const origin = 'http://127.0.0.1:5200';
const fixtures = [
  {environment: 'BZDS', counts: [8, 3, 5], online: ['a', 'b', 'c'], offline: ['cxy2', 'cxy2', 'd', 'e', 'f'], accountTypes: {online: ['wx', 'wx', 'wx'], offline: ['qw', 'qw', 'qw', 'qw', 'qw']}, typeEvidence: {status: 'complete'}},
  {environment: 'Zero', counts: [0, 0, 0], online: [], offline: []},
  {environment: 'Mixed', counts: [3, 2, 1], online: ['same', 'same'], offline: ['off'], accountTypes: {online: ['wx', 'qw'], offline: ['qw']}, typeEvidence: {status: 'not-captured'}},
  {environment: 'Mismatch', counts: [4, 3, 1], online: ['one', 'two'], offline: ['three'], accountTypes: {online: ['wx', 'wx'], offline: ['qw']}, typeEvidence: {status: 'complete'}},
  {environment: 'Long', counts: [1, 1, 0], online: ['长名称ABCDEFGHIJKLMN'.repeat(18)], offline: [], accountTypes: {online: ['qw'], offline: []}, typeEvidence: {status: 'complete'}},
];
const invalidFixtures = [
  {environment: 'MissingTypes', counts: [1, 1, 0], online: ['preserve-me'], offline: []},
  {environment: 'InvalidType', counts: [1, 1, 0], online: ['preserve-me'], offline: [], accountTypes: {online: ['unknown'], offline: []}},
  {environment: 'MissingEntry', counts: [2, 2, 0], online: ['same', 'same'], offline: [], accountTypes: {online: ['wx'], offline: []}},
  {environment: 'ExtraEntry', counts: [1, 1, 0], online: ['preserve-me'], offline: [], accountTypes: {online: ['wx', 'qw'], offline: []}},
];

(async () => {
  const browser = await chromium.launch({channel: 'chrome', headless: true});
  const results = [], errors = [], external = [];
  try {
    const context = await browser.newContext({viewport: {width: 1366, height: 900}, serviceWorkers: 'block'});
    // Only this already-running local preview may be reached. Any accidental
    // external request is blocked before sending and fails the final assertion.
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
      external.push(url);
      return route.abort('blockedbyclient');
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/prototype/admin-content.html?tenant=bzds&route=allWeChatStatus');
    const initialValidation = await page.evaluate(() => AdminAllAccountStatus.validateData());
    assert.equal(initialValidation.valid, true, JSON.stringify(initialValidation.issues));
    await page.locator('.account-status-table tbody tr').last().waitFor();
    const original = await page.evaluate(() => structuredClone(AdminAllAccountStatusData.wechat));
    const read = () => page.locator('.account-status-table tbody tr').evaluateAll(elements => elements.map(row => ({
      environment: row.cells[0].innerText,
      statistics: Object.fromEntries([...row.cells[1].querySelectorAll('[data-account-type]')].map(element => [
        element.dataset.accountType,
        [...element.querySelectorAll('.account-status-badge')].map(badge => badge.textContent),
      ])),
      online: [...row.cells[2].querySelectorAll('.account-status-badge')].map(element => element.textContent),
      offline: [...row.cells[3].querySelectorAll('.account-status-badge')].map(element => element.textContent),
    })));

    let rendered = await read();
    assert.equal(rendered.length, 43);
    for (let index = 0; index < original.length; index++) {
      assert.deepEqual(Object.keys(rendered[index].statistics), ['wx', 'qw', 'total']);
      assert.deepEqual(rendered[index].statistics.total, original[index].counts.map(String));
      for (const type of ['wx', 'qw']) {
        const online = original[index].online.filter((_, entryIndex) => original[index].accountTypes.online[entryIndex] === type).length;
        const offline = original[index].offline.filter((_, entryIndex) => original[index].accountTypes.offline[entryIndex] === type).length;
        assert.deepEqual(rendered[index].statistics[type], [online + offline, online, offline].map(String));
      }
      for (const kind of ['online', 'offline']) {
        assert.deepEqual([...rendered[index][kind]].sort(), [...original[index][kind]].sort());
        const expected = ['wx', 'qw'].flatMap(type => original[index][kind].filter((_, entryIndex) => original[index].accountTypes[kind][entryIndex] === type));
        assert.deepEqual(rendered[index][kind], expected);
      }
    }
    assert.equal(await page.locator('[data-account-type="unknown"],.account-status-stat-note,.account-status-stat-warning').count(), 0);
    results.push('All 43 source rows have complete wx/qw coverage, exact category counts, original totals and all duplicate names in source order');

    const originalNames = original.map(row => row.environment);
    for (const expected of [[...originalNames].sort(), [...originalNames].sort().reverse(), originalNames]) {
      await page.locator('.account-status-sort').click();
      assert.deepEqual(await page.locator('.account-status-table tbody tr td:first-child').allTextContents(), expected);
    }
    results.push('Three-state environment sorting and original-order reset');

    const before = await page.locator('.account-status-table thead').boundingBox();
    await page.locator('.account-status-table-scroll').evaluate(element => { element.scrollTop = 900; });
    await page.waitForTimeout(100);
    const after = await page.locator('.account-status-table thead').boundingBox();
    assert.ok(Math.abs(before.y - after.y) < 2);
    results.push('Existing shared fixed-header mechanism remains at the same viewport position');

    await page.getByRole('tab', {name: '代理账号', exact: true}).click();
    assert.equal(await page.locator('.account-status-proxy-card').count(), 118);
    await page.getByRole('tab', {name: '代理账号', exact: true}).press('ArrowLeft');
    assert.equal(await page.locator('.account-status-table-scroll').evaluate(element => element.scrollTop), 900);
    results.push('All 118 proxy cards, keyboard tab switch and WeChat scroll restoration');

    await page.evaluate(rows => {
      AdminAllAccountStatusData.wechat = rows;
      AdminAllAccountStatus.render();
    }, fixtures);
    rendered = await read();
    assert.deepEqual(rendered[0].statistics, {wx: ['3', '3', '0'], qw: ['5', '0', '5'], total: ['8', '3', '5']});
    assert.equal(rendered[0].offline.filter(name => name === 'cxy2').length, 2);
    results.push('Approved 3/3/0 + 5/0/5 = 8/3/5 example and repeated cxy2 entries');

    assert.deepEqual(rendered[1].statistics, {wx: ['0', '0', '0'], qw: ['0', '0', '0'], total: ['0', '0', '0']});
    assert.equal(await page.locator('.account-status-table tbody tr').nth(1).locator('.account-status-empty-group').filter({hasText: '无账号'}).count(), 4);
    results.push('Confirmed empty environments display zero and no-account groups');

    assert.deepEqual(rendered[2].statistics, {wx: ['1', '1', '0'], qw: ['2', '1', '1'], total: ['3', '2', '1']});
    assert.deepEqual(rendered[2].online, ['same', 'same']);
    assert.doesNotMatch(await page.locator('.account-status-live').innerText(), /待核对|已核实|采集/);
    results.push('Only wx/qw business categories render; evidence metadata does not add collection states or lose duplicate names');

    assert.deepEqual(rendered[3].statistics.total, ['4', '3', '1']);
    assert.deepEqual(rendered[3].statistics.wx, ['2', '2', '0']);
    const fixtureValidation = await page.evaluate(() => AdminAllAccountStatus.validateData());
    assert.equal(fixtureValidation.valid, true);
    assert.equal(fixtureValidation.warnings.length, 1);
    results.push('Source count mismatches preserve original totals and remain internal developer diagnostics');

    for (const invalid of invalidFixtures) {
      const rejected = await page.evaluate(row => {
        const previousRows = AdminAllAccountStatusData.wechat;
        const previousPage = document.querySelector('.account-status-live');
        const previousText = previousPage.textContent;
        AdminAllAccountStatusData.wechat = [row];
        try {
          const validation = AdminAllAccountStatus.validateData();
          const rendered = AdminAllAccountStatus.render();
          return {
            valid: validation.valid,
            issues: validation.issues.length,
            rendered,
            sameNode: document.querySelector('.account-status-live') === previousPage,
            unchanged: previousPage.textContent === previousText,
          };
        } finally {
          AdminAllAccountStatusData.wechat = previousRows;
        }
      }, invalid);
      assert.equal(rejected.valid, false);
      assert.ok(rejected.issues > 0);
      assert.equal(rejected.rendered, false);
      assert.equal(rejected.sameNode, true);
      assert.equal(rejected.unchanged, true);
    }
    results.push('Missing, unsupported and misaligned account types are rejected before DOM replacement, never guessed or dropped');

    await page.setViewportSize({width: 760, height: 800});
    const long = page.locator('.account-status-table tbody tr').last().locator('.account-status-name-badges .account-status-badge');
    const geometry = await long.evaluate(element => ({
      height: element.getBoundingClientRect().height,
      width: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      parent: element.closest('td').getBoundingClientRect().width,
      text: element.textContent,
    }));
    assert.ok(geometry.height > 24 && geometry.width <= geometry.parent && geometry.scrollWidth <= geometry.clientWidth + 1);
    assert.equal(geometry.text, fixtures[4].online[0]);
    const overflow = await page.locator('.account-status-live').evaluate(element => ({width: element.clientWidth, scroll: element.scrollWidth, body: document.body.scrollWidth, viewport: innerWidth}));
    assert.ok(overflow.scroll <= overflow.width + 1 && overflow.body <= overflow.viewport + 1);
    results.push('Long names fully wrap inside badges without clipping or document overflow at 760px');

    assert.equal(await page.evaluate(() => { Admin.tenant = 'yestar-sz'; return AdminAllAccountStatus.render(); }), false);
    results.push('Existing tenant guard prevents the platform component rendering for a different tenant');

    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push('No JavaScript errors or external requests');
    const report = {
      verifiedAt: new Date().toISOString(),
      passed: results,
      errors,
      external,
      livePrototypeRowsVerified: original.length,
      sourceCountDiagnostics: initialValidation.warnings,
      edgeCasesUseInMemoryFixtures: true,
      sourceFilesMutated: false,
      externalNetworkBlocked: true,
    };
    fs.writeFileSync(path.join(__dirname, 'component-verification.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({passed: results.length, results}, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });

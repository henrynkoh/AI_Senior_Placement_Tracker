const { test, expect } = require('@playwright/test');

test.beforeEach(async ({page}) => {
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('navigation and fictional-only disclosure visible', async ({page}) => {
  await expect(page.getByText('Demonstration only. All cases are fictional.')).toBeVisible();
  for (const [label,title] of [
    ['Cases','Cases'],['Intake','Intake — training only'],
    ['Checklist','Verification checklist'],['Follow-up','Follow-up queue'],
    ['Weekly report','Weekly report'],['Sheets','Sheets / CSV export'],
    ['Sources','Official sources'],['QA','QA — in-browser guards'],['Desk','Desk overview']
  ]) {
    await page.getByRole('navigation').getByRole('button',{name:label,exact:true}).click();
    await expect(page.getByRole('heading',{name:title})).toBeVisible();
  }
});

test('fictional case edit persists across reload, reset works', async ({page}) => {
  await page.getByRole('button',{name:'Cases',exact:true}).click();
  await page.locator('[data-open="SP-002"]').click();
  await page.getByLabel('Assigned staff').fill('Fictional Staff B');
  await page.getByRole('button',{name:'Save fictional case'}).click();
  await expect(page.getByRole('status')).toContainText('Saved on this browser only');
  await page.reload();
  await page.getByRole('button',{name:'Cases',exact:true}).click();
  await page.locator('[data-open="SP-002"]').click();
  await expect(page.getByLabel('Assigned staff')).toHaveValue('Fictional Staff B');
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:'Reset fictional data'}).click();
  await page.getByRole('button',{name:'Cases',exact:true}).click();
  await page.locator('[data-open="SP-002"]').click();
  await expect(page.getByLabel('Assigned staff')).toHaveValue('Solo operator');
});

test('rejects eligibility guarantee and SSN-like input',async ({page})=>{
  await page.getByRole('button',{name:'Cases',exact:true}).click();
  await page.locator('[data-open="SP-001"]').click();
  await page.getByLabel('Next action').fill('The household is approved for Medicaid');
  await page.getByRole('button',{name:'Save fictional case'}).click();
  await expect(page.getByRole('status')).toContainText('Rejected');
  await page.getByLabel('Next action').fill('Person has SSN 123-45-6789');
  await page.getByRole('button',{name:'Save fictional case'}).click();
  await expect(page.getByRole('status')).toContainText('Rejected');
});

test('pending consent prevents outreach instruction',async ({page})=>{
  await page.getByRole('button',{name:'Cases',exact:true}).click();
  await page.locator('[data-open="SP-006"]').click();
  await page.getByLabel('Next action').fill('Send an email to HCS');
  await page.getByRole('button',{name:'Save fictional case'}).click();
  await expect(page.getByRole('status')).toContainText('Consent guard');
});

test('CSV export contains exactly ten fictional cases',async ({page})=>{
  await page.getByRole('button',{name:'Sheets',exact:true}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download fictional CSV'}).click();
  const d=await downloadPromise;
  expect(d.suggestedFilename()).toBe('Senior_Placement_Tracker_FICTIONAL.csv');
  const path=await d.path();
  const content=require('node:fs').readFileSync(path,'utf8');
  expect(content.match(/SP-00[1-9]|SP-010/g)).toHaveLength(10);
  expect(content).not.toMatch(/approved for medicaid/i);
});

test('QA checks pass for seeded fictional test cases', async ({page}) => {
 await page.getByRole('button',{name:'QA',exact:true}).click();
 await expect(page.getByRole('heading',{name:'9 / 9 demo checks passed'})).toBeVisible();
});

test('intake is disabled for real clients', async ({page})=>{
 await page.getByRole('button',{name:'Intake',exact:true}).click();
 await expect(page.getByText('real client intake is disabled.')).toBeVisible();
 await expect(page.locator('input[type="checkbox"]')).toBeDisabled();
});

const {test,expect}=require("@playwright/test");
test.beforeEach(async({page})=>{await page.goto("http://127.0.0.1:4173/");await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole("navigation").getByRole("button",{name:"Email demo"}).click();});
test("email draft uses seven configured identity slots but no send",async({page})=>{
 await expect(page.getByRole("heading",{name:"Email workflow — fictional demo"})).toBeVisible();
 await expect(page.locator("#mail-from option")).toHaveCount(7);
 await expect(page.locator("#mail-to option")).toHaveCount(7);
 await expect(page.getByRole("button",{name:"Send email (disabled)"})).toBeDisabled();
 await page.getByRole("button",{name:"Prepare fictional draft"}).click();
 await expect(page.getByRole("status")).toContainText("Fictional draft prepared");
 await page.getByRole("button",{name:"Review fictional draft"}).click();
 await page.getByRole("button",{name:"Approve fictional draft"}).click();
 await expect(page.getByText("approved_not_sent")).toBeVisible();
 await expect(page.getByText("Not sent",{exact:true})).toBeVisible();
 await page.reload();
 await page.getByRole("navigation").getByRole("button",{name:"Email demo"}).click();
 await expect(page.getByText("approved_not_sent")).toBeVisible();
});
test("pending and declined consent cases cannot be drafted",async({page})=>{
 await expect(page.locator("#mail-case option[value='SP-006']")).toHaveCount(0);
 await expect(page.locator("#mail-case option[value='SP-010']")).toHaveCount(0);
});
test("unsupported approval claims block draft",async({page})=>{
 await page.getByLabel("Message body (fictional only)").fill("FICTIONAL TEST: approved for Medicaid");
 await page.getByRole("button",{name:"Prepare fictional draft"}).click();
 await expect(page.getByRole("status")).toContainText("Blocked");
 await expect(page.getByRole("button",{name:"Review fictional draft"})).toHaveCount(0);
});
test("global reset clears fictional mail audit",async({page})=>{
 await page.getByRole("button",{name:"Prepare fictional draft"}).click();
 await expect(page.getByRole("button",{name:"Review fictional draft"})).toHaveCount(1);
 page.once("dialog",d=>d.accept());
 await page.getByRole("button",{name:"Reset fictional data"}).click();
 await page.getByRole("navigation").getByRole("button",{name:"Email demo"}).click();
 await expect(page.getByText("No fictional draft prepared yet.")).toBeVisible();
});

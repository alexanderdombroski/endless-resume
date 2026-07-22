import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:4173";
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "password";

/** Reusable helper — opens the dialog and submits credentials. */
async function loginViaDialog(
  page: import("@playwright/test").Page,
  email = TEST_EMAIL,
  password = TEST_PASSWORD
) {
  await page.getByLabel("Primary").getByRole("button", { name: "Sign in / Register" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  // Use the submit button inside the open dialog
  await page.locator("dialog[open] form .ld-submit").click();
}

test.describe("Login flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("opens the login dialog when clicking Sign in / Register", async ({ page }) => {
    await page.getByLabel("Primary").getByRole("button", { name: "Sign in / Register" }).click();

    await expect(page.getByRole("tab", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Create account" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("logs in with valid credentials and shows avatar", async ({ page }) => {
    await loginViaDialog(page);

    // Should redirect to /dashboard after login
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // Avatar button should appear (letter = first char of name or email)
    const avatarBtn = page.getByRole("button", { name: "Account menu" });
    await expect(avatarBtn).toBeVisible();
    await expect(avatarBtn).toContainText(/[A-Z]/);
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await loginViaDialog(page, TEST_EMAIL, "wrongpassword");

    // Error alert should appear; dialog must still be open
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 8_000 });
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("can switch to Create account tab and back", async ({ page }) => {
    await page.getByLabel("Primary").getByRole("button", { name: "Sign in / Register" }).click();

    // Switch to register — name field appears
    await page.getByRole("tab", { name: "Create account" }).click();
    await expect(page.getByLabel("Full name")).toBeVisible();

    // Switch back — name field disappears
    await page.getByRole("tab", { name: "Sign in" }).click();
    await expect(page.getByLabel("Full name")).not.toBeVisible();
  });

  test("closes the dialog when clicking the backdrop", async ({ page }) => {
    await page.getByLabel("Primary").getByRole("button", { name: "Sign in / Register" }).click();
    await expect(page.getByLabel("Email")).toBeVisible();

    // The native <dialog> covers the full viewport; click a corner far from the
    // centered panel (top-left at 8,8 is reliably outside the 480px-wide panel).
    await page.mouse.click(8, 8);

    await expect(page.getByLabel("Email")).not.toBeVisible();
  });
});

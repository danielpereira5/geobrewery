import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('You did it!');
});

test('complete location analysis workflow', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Wait for the map to load
  await page.waitForSelector('.leaflet-container', { timeout: 10000 });

  // Wait for brewery markers to appear
  await page.waitForSelector('.leaflet-marker-icon', { timeout: 15000 });

  // Click on a location (Austin, TX area)
  const mapContainer = page.locator('.leaflet-container');
  await mapContainer.click({ position: { x: 400, y: 300 } });

  // Wait for the sidebar to appear with location data
  await page.waitForSelector('[data-testid="location-details"]', { timeout: 10000 });

  // Verify state information is displayed
  await expect(page.locator('[data-testid="state-name"]')).toBeVisible();

  // Verify brewery analysis is shown
  await expect(page.locator('[data-testid="brewery-count"]')).toBeVisible();

  // Verify market analysis is displayed
  await expect(page.locator('[data-testid="market-saturation"]')).toBeVisible();

  // Verify beer style analysis is shown
  await expect(page.locator('[data-testid="beer-styles"]')).toBeVisible();
});

test('map interaction and brewery popup', async ({ page }) => {
  await page.goto('/');

  // Wait for map and markers to load
  await page.waitForSelector('.leaflet-container', { timeout: 10000 });
  await page.waitForSelector('.leaflet-marker-icon', { timeout: 15000 });

  // Click on a brewery marker
  const breweryMarker = page.locator('.leaflet-marker-icon').first();
  await breweryMarker.click();

  // Wait for popup to appear
  await page.waitForSelector('.leaflet-popup', { timeout: 5000 });

  // Verify popup content
  await expect(page.locator('.leaflet-popup-content')).toBeVisible();
  await expect(page.locator('.leaflet-popup-content')).toContainText('Brewery');
});

test('responsive design on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');

  // Wait for map to load
  await page.waitForSelector('.leaflet-container', { timeout: 10000 });

  // Verify map is visible on mobile
  await expect(page.locator('.leaflet-container')).toBeVisible();

  // Click on map
  const mapContainer = page.locator('.leaflet-container');
  await mapContainer.click({ position: { x: 200, y: 200 } });

  // Wait for sidebar to appear
  await page.waitForSelector('[data-testid="location-details"]', { timeout: 10000 });

  // Verify sidebar is responsive
  await expect(page.locator('[data-testid="location-details"]')).toBeVisible();
});

test('error handling for invalid locations', async ({ page }) => {
  await page.goto('/');

  // Wait for map to load
  await page.waitForSelector('.leaflet-container', { timeout: 10000 });

  // Click on a location outside the US (ocean)
  const mapContainer = page.locator('.leaflet-container');
  await mapContainer.click({ position: { x: 50, y: 50 } });

  // Wait a bit for any processing
  await page.waitForTimeout(2000);

  // Verify the app doesn't crash and shows appropriate message
  // The app should handle this gracefully
  await expect(page.locator('.leaflet-container')).toBeVisible();
});

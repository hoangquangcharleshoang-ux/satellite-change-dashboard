import { expect, type Page, test } from '@playwright/test'

const appOrigin = new URL('http://127.0.0.1:4173').origin

const geoJsonAssets = [
  {
    name: 'vegetation loss',
    path: '/sample-analysis/geojson/vegetation-loss.geojson',
  },
  {
    name: 'vegetation gain',
    path: '/sample-analysis/geojson/vegetation-gain.geojson',
  },
  {
    name: 'potential urban expansion',
    path: '/sample-analysis/geojson/potential-urban-expansion.geojson',
  },
] as const

function isOpenStreetMapTile(urlValue: string) {
  try {
    return new URL(urlValue).hostname === 'tile.openstreetmap.org'
  } catch {
    return urlValue.includes('tile.openstreetmap.org')
  }
}

function collectBrowserFailures(page: Page) {
  const failures: string[] = []

  page.on('pageerror', (error) => {
    failures.push(`Uncaught page error: ${error.message}`)
  })

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return
    }

    const sourceUrl = message.location().url
    if (
      isOpenStreetMapTile(sourceUrl) ||
      isOpenStreetMapTile(message.text())
    ) {
      return
    }

    failures.push(`Console error: ${message.text()}`)
  })

  page.on('response', (response) => {
    const url = new URL(response.url())
    if (url.origin === appOrigin && response.status() >= 400) {
      failures.push(
        `Same-origin response failed: ${response.status()} ${response.url()}`,
      )
    }
  })

  page.on('requestfailed', (request) => {
    const requestUrl = request.url()
    if (isOpenStreetMapTile(requestUrl)) {
      return
    }

    const errorText = request.failure()?.errorText ?? 'unknown request error'
    const origin = new URL(requestUrl).origin
    const scope = origin === appOrigin ? 'Same-origin' : 'External'
    failures.push(`${scope} request failed: ${requestUrl} (${errorText})`)
  })

  return failures
}

function expectNoBrowserFailures(failures: string[]) {
  expect(failures, failures.join('\n')).toEqual([])
}

test('root route renders the dashboard, map, and comparison chart', async ({
  page,
}) => {
  const failures = collectBrowserFailures(page)
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

  expect(response?.ok()).toBe(true)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Phenikaa Hospital Area, Hanoi',
    }),
  ).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)

  const map = page.getByRole('region', {
    name: 'Phenikaa change detection map',
  })
  await expect(map).toBeVisible()
  await expect(map.locator('canvas.maplibregl-canvas')).toBeVisible()

  const chart = page.getByRole('img', {
    name: 'Area comparison chart for detected change categories',
  })
  await expect(chart).toBeVisible()
  await expect(chart).toContainText('Vegetation loss')
  await expect(chart).toContainText('Vegetation gain')
  await expect(chart).toContainText(/Urban expansion\s*candidate/)

  expectNoBrowserFailures(failures)
})

test('report route supports direct navigation and reload', async ({ page }) => {
  const failures = collectBrowserFailures(page)
  const heading = page.getByRole('heading', {
    level: 1,
    name: 'Satellite Change Detection Report',
  })

  const directResponse = await page.goto('/report', {
    waitUntil: 'domcontentloaded',
  })
  expect(directResponse?.ok()).toBe(true)
  await expect(heading).toBeVisible()
  await page.evaluate(async () => document.fonts.ready)

  const reloadResponse = await page.reload({ waitUntil: 'domcontentloaded' })
  expect(reloadResponse?.ok()).toBe(true)
  await expect(heading).toBeVisible()
  await page.evaluate(async () => document.fonts.ready)
  await expect(page).toHaveURL(/\/report$/)
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByText('404', { exact: true })).toHaveCount(0)

  expectNoBrowserFailures(failures)
})

test('report renders committed analysis and validation content', async ({
  page,
}) => {
  const failures = collectBrowserFailures(page)
  await page.goto('/report', { waitUntil: 'domcontentloaded' })

  await expect(
    page.getByText('COPERNICUS/S2_SR_HARMONIZED', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('2018-10-01 to 2019-04-30', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('2024-10-01 to 2025-04-30', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText('5 images', { exact: true })).toBeVisible()
  await expect(page.getByText('10 images', { exact: true })).toBeVisible()

  await expect(page.getByText('Vegetation loss', { exact: true })).toBeVisible()
  await expect(page.getByText(/0\.584 km/)).toBeVisible()
  await expect(page.getByText('Vegetation gain', { exact: true })).toBeVisible()
  await expect(page.getByText(/0\.359 km/)).toBeVisible()
  await expect(
    page.getByText('Potential urban expansion', { exact: true }),
  ).toBeVisible()
  await expect(page.getByText(/0\.332 km/)).toBeVisible()
  await expect(
    page.getByText(
      'NDVI_Diff < NDVI loss threshold AND NDBI_Diff > NDBI gain threshold',
      { exact: true },
    ),
  ).toBeVisible()

  for (const validationId of ['V01', 'V02', 'V03']) {
    await expect(page.getByText(validationId, { exact: true })).toBeVisible()
  }

  await expect(page.getByRole('alert')).toHaveCount(0)
  expectNoBrowserFailures(failures)
})

test('analysis summary JSON is available and parseable', async ({ request }) => {
  const response = await request.get(
    '/sample-analysis/phenikaa-area-ndvi-change.json',
  )

  expect(response.status()).toBe(200)
  const summary = (await response.json()) as Record<string, unknown>
  expect(summary).toMatchObject({
    dataset: 'COPERNICUS/S2_SR_HARMONIZED',
    imageCounts: { after: 10, before: 5 },
  })
})

for (const asset of geoJsonAssets) {
  test(`${asset.name} GeoJSON is a populated FeatureCollection`, async ({
    request,
  }) => {
    const response = await request.get(asset.path)

    expect(response.status()).toBe(200)
    const geoJson = (await response.json()) as {
      features?: unknown
      type?: unknown
    }
    expect(geoJson.type).toBe('FeatureCollection')
    expect(Array.isArray(geoJson.features)).toBe(true)
    expect((geoJson.features as unknown[]).length).toBeGreaterThan(0)
  })
}

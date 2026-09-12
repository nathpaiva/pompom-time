import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const redirectsFile = readFileSync(
  resolve(process.cwd(), 'public/_redirects'),
  'utf8',
)

describe('public/_redirects', () => {
  it('should serve index.html for unknown paths (SPA fallback)', () => {
    // Without this rule Netlify returns its own 404 on a hard reload of any
    // non-root route (/admin/workout, /login, ...). See issue #112.
    //
    // This lives in public/_redirects, not netlify.toml, on purpose: a
    // netlify.toml [[redirects]] block also applies to `netlify dev` in proxy
    // mode (the normal `yarn dev` workflow), where it intercepts every Vite
    // module request too and breaks the whole app. public/_redirects only
    // takes effect once `vite build` copies it into dist/, which is exactly
    // where the SPA fallback is needed. See issue #118.
    expect(redirectsFile).toMatch(/^\/\*\s+\/index\.html\s+200\s*$/m)
  })
})

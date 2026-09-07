import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const netlifyToml = readFileSync(
  resolve(process.cwd(), 'netlify.toml'),
  'utf8',
)

describe('netlify.toml redirects', () => {
  it('should serve index.html for unknown paths (SPA fallback)', () => {
    // Without this rule Netlify returns its own 404 on a hard reload of any
    // non-root route (/admin/workout, /login, ...). See issue #112.
    const redirectBlock = netlifyToml.match(/\[\[redirects\]\][\s\S]*/)?.[0] ?? ''

    expect(redirectBlock).toMatch(/from\s*=\s*"\/\*"/)
    expect(redirectBlock).toMatch(/to\s*=\s*"\/index\.html"/)
    expect(redirectBlock).toMatch(/status\s*=\s*200/)
  })
})

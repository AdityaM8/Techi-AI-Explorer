/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self' blob: data: https: http:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:",
      "style-src 'self' 'unsafe-inline' https: http:",
      "img-src 'self' blob: data: https: http:",
      "frame-src *",
      "connect-src 'self' https: http: ws: wss:",
      "font-src 'self' data: https: http:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https: http:"
    ].join('; ')
  },
  { key: 'Referrer-Policy', value: 'same-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' }
]

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] },
}

export default nextConfig

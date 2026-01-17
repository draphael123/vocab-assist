/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static generation to avoid ThemeProvider context issues
  output: 'standalone',
}

module.exports = nextConfig


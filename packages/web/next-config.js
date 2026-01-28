/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! PERIGOSO MAS ÚTIL !!
    // Isso permite que o build complete mesmo com erros de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Também ignora erros de lint no build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
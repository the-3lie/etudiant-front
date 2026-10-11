/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // Capacitor sert les fichiers via un chemin relatif (capacitor://
  // ou file://), pas depuis la racine d'un domaine.
  trailingSlash: true,
};

module.exports = nextConfig;

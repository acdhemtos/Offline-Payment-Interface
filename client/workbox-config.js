module.exports = {
  globDirectory: 'dist/',
  globPatterns: ['**/*.{html,js,css,png,jpg,json}'],
  swDest: 'dist/sw.js',
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'js-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'css-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
};
module.exports = {
  pwa: {
    name: 'Caesh',
    msTileColor: '#FFFFFF',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('\.(?:css|js|)$'),
          handler: 'networkFirst'
        },
        {
          urlPattern: new RegExp('\.(?:png|gif|jpg|jpeg|svg)$'),
          handler: 'cacheFirst'
        }
      ]
    }
  }
}
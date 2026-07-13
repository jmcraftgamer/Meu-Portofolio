const images = import.meta.glob('/public/apps/mercado/web/**/*', { eager: true, query: '?url' })
const assets = import.meta.glob('/public/apps/mercado/web/assets/**/*', { eager: true, query: '?url' })
export default { images, assets }

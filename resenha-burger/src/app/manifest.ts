import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Resenha Burger',
    short_name: 'Resenha',
    description: 'O melhor hambúrguer do shopping',
    start_url: '/',
    display: 'standalone', // ISSO remove a barra do navegador
    background_color: '#ffffff',
    theme_color: '#EA1D2C',
    icons: [
      {
        src: '/burger1.png', 
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/burger2.png', 
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

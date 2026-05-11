import './globals.css'
import Navbar from '../components/organisms/navbar'

export const metadata = {
  title: 'anti-infernum - Gestión de Incendios',
  description: 'Plataforma inteligente para la prevención de desastres',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
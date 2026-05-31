import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getAllCategories } from '@/lib/products'

export const metadata = {
  title: {
    default: 'NOVA · Premium Tech, Reimagined',
    template: '%s · NOVA',
  },
  description:
    'NOVA — premium smartphones, laptops, tablets, audio gear and smartwatches. Designed for the future.',
  metadataBase: new URL('https://nova.example.com'),
}

export const viewport = {
  themeColor: '#ffffff',
}

export default async function RootLayout({ children }) {
  const categories = await getAllCategories()

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-zinc-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <Header categories={categories} />
            <main className="min-h-[60vh]">{children}</main>
            <Footer categories={categories} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

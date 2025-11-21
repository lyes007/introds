import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TranslationProvider } from '@/contexts/TranslationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ML Models Visualization - Ad Click Prediction',
  description: 'Interactive visualizations explaining how machine learning models work',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  )
}


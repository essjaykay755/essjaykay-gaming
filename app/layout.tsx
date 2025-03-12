import type { Metadata } from 'next'
import './globals.css'
import { GameProvider } from './context/GameContext'
import { CheatCodeWrapper } from './components/CheatCodeWrapper'

export const metadata: Metadata = {
  title: 'EssJayKay Gaming',
  description: 'Your ultimate destination for gaming content and community',
  generator: 'EssJayKay.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {children}
          <CheatCodeWrapper />
        </GameProvider>
      </body>
    </html>
  )
}

// src/components/Layout.tsx
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center bg-[#F3F4F6] min-h-screen"> 
      <div className="w-full flex flex-col bg-white shadow-sm">
        <header className="bg-gray-300 border-b border-gray-400">
          <div className="px-4 py-6">
            <h1 className="text-center text-4xl font-serif text-gray-800">
              DayTime
            </h1>
          </div>
        </header>

        {/* 본문 영역*/}
        <main className="px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

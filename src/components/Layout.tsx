// src/components/Layout.tsx
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex justify-center bg-[#F3F4F6] min-h-screen"> 
      {/* 
        body 전체는 연한 회색(#F3F4F6) 배경을 깔았고, 
        가운데에 고정 폭 박스(가로 최대 480px 정도)를 두기 위해 flex+justify-center 적용.
      */}
      <div className="w-full flex flex-col bg-white shadow-sm">
        {/* 
          max-w-md (≈ 28rem, 약 448px) 또는 필요에 따라 max-w-lg(≈32rem, 512px) 등으로 고정 폭 지정.
          shadow-sm으로 살짝 그림자 줘서 주변과 구분감을 줄 수 있음(옵션).
        */}

        {/* === 헤더 (사진의 빨간 외곽과 동일한 영역) === */}
        <header className="bg-gray-300 border-b border-gray-400">
          <div className="px-4 py-6">
            <h1 className="text-center text-4xl font-serif text-gray-800">
              DayTime
            </h1>
          </div>
        </header>

        {/* === 본문(Container) (사진의 파란 외곽과 동일한 영역) === */}
        <main className="px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

// src/pages/Home.tsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      {/* 
        사진과 동일하게, 버튼들은 네모 박스 안에서 아래쪽으로 중앙 정렬된 상태.
        버튼 간 세로 간격은 1rem(16px) 정도로 space-y-4 사용.
      */}
      <div className="grid gap-5 ">
        {/* gap-3으로 버튼 사이 간격(가로세로 약 0.75rem, ≈12px)을 잡아 줌 */}
        <Link
          to="/date-diff"
          className="w-36 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-base font-medium transition-colors shadow-sm"
        >
          날짜 차이 계산기
        </Link>

        <Link
          to="/time-calc"
          className="w-36 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-base font-medium transition-colors shadow-sm"
        >
          시간 계산기
        </Link>

        <Link
          to="/age-diff"
          className="w-36 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-base font-medium transition-colors shadow-sm"
        >
          나이 차이 계산기
        </Link>

        <Link
          to="/age-calc"
          className="w-36 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-base font-medium transition-colors shadow-sm"
        >
          나이 계산기
        </Link>
      <Link
        to="/dday-calc"
        className="w-36 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-base font-medium transition-colors shadow-sm"
      >
        디데이 계산기
      </Link>
      </div>
    </div>
  )
}

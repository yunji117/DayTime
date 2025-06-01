// src/pages/Home.tsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <div className="grid gap-5 ">
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

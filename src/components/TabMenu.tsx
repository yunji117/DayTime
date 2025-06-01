// src/components/TabMenu.tsx
import { NavLink } from 'react-router-dom'

export default function TabMenu() {
  // 나중에 라우트 추가/삭제가 편하기 위해 배열로 정의함
  const tabs = [
    { label: '홈', to: '/' },
    { label: '날짜 차이 계산기', to: '/date-diff' },
    { label: '시간 계산기',       to: '/time-calc' },
    { label: '나이 차이 계산기', to: '/age-diff' },
    { label: '나이 계산기',       to: '/age-calc' },
    { label: '디데이 계산기',     to: '/dday-calc' },
  ]

  return (
    <nav className=" mb-10">
      <div className="max-w-md mx-auto py-3 flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              [
                'flex-shrink-0 px-3 py-1 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

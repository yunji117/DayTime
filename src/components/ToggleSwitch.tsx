// src/components/ToggleSwitch.tsx
import type { FC } from 'react'

interface ToggleSwitchProps {
  /**
   * 스위치가 켜진(on) 상태인지 여부
   * - 예: true -> '오늘부터' 상태
   * - false -> '오늘까지' 상태
   */
  checked: boolean
  /**
   * 상태가 바뀔 때 호출되는 콜백 (checked=true/false)
   */
  onChange: (checked: boolean) => void
  /**
   * 토글 왼쪽에 붙일 라벨
   */
  labelLeft?: string
  /**
   * 토글 오른쪽에 붙일 라벨
   */
  labelRight?: string
}

/**
 * - checked=true 시 오른쪽(파란색)으로, false 시 왼쪽(회색)으로 이동
 * - Tailwind CSS를 이용해 스타일링
 */
const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  labelLeft = '오늘부터',
  labelRight = '오늘까지',
}) => {
  return (
    <div className="flex flex-col items-center">
      {/* 좌우 라벨 */}
      <div className="flex items-center space-x-2 mb-1">
        <span
          className={`text-sm font-medium ${
            checked ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          {labelLeft}
        </span>
        <span
          className={`text-sm font-medium ${
            checked ? 'text-gray-800' : 'text-gray-400'
          }`}
        >
          {labelRight}
        </span>
      </div>

      {/* 실제 토글 스위치 */}
      <label className="relative inline-flex items-center cursor-pointer">
        {/* 숨겨진 체크박스 */}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        {/* 스위치 트랙 (가로 바탕) */}
        <div
          className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer
                     peer-checked:bg-blue-500 transition-colors"
        />
        {/* 스위치 노브 (동그라미) */}
        <div
          className="absolute left-1 top-1 w-5 h-5 bg-white border border-gray-300 rounded-full
                     peer-checked:translate-x-7 peer-checked:border-blue-500 transition-transform"
        />
      </label>
    </div>
  )
}

export default ToggleSwitch

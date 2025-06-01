// src/pages/DDayCalc.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import ToggleSwitch from '../components/ToggleSwitch'
import TabMenu from '../components/TabMenu'

dayjs.locale('ko')

interface FormValues {
  year: string
  month: string
  day: string
  includeToday: boolean
}

type Mode = 'none' | 'result'

export default function DDayCalc() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
  } = useForm<FormValues>({ mode: 'onSubmit', defaultValues: { includeToday: false } })
  const { errors } = formState

  const [mode, setMode] = useState<Mode>('none')
  const [result, setResult] = useState<{
    todayLabel: string
    targetLabel: string
    diffDays: number
  } | null>(null)

  // boolean으로 토글 상태 관리 (true = '오늘부터', false = '오늘까지')
 const [isFrom, setIsFrom] = useState<boolean>(true)

  const navigate = useNavigate()

  // “YYYY년 MM월 DD일(ddd)” 리셋
  const formatDate = (d: dayjs.Dayjs): string => {
    return d.format('YYYY년 MM월 DD일(ddd)')
  }

  // “계산하기” 처리
  const onSubmit = (data: FormValues) => {
    const y = parseInt(data.year || '', 10)
    const mo = parseInt(data.month || '', 10)
    const d = parseInt(data.day || '', 10)
    const include = data.includeToday

    if (isNaN(y) || isNaN(mo) || isNaN(d)) {
      alert('연·월·일을 정확히 입력해주세요.')
      return
    }
    if (mo < 1 || mo > 12 || d < 1 || d > 31) {
      alert('월은 1~12, 일은 1~31 사이 숫자로 입력해주세요.')
      return
    }

    const target = dayjs(
      `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      'YYYY-MM-DD'
    )
    if (!target.isValid()) {
      alert('유효한 날짜를 입력해주세요.')
      return
    }

    const today = dayjs().startOf('day')
    let diff = 0

    if (isFrom) {
      // '오늘부터' 모드: target - today
      diff = target.diff(today, 'day')
    } else {
      // '오늘까지' 모드: today - target
      diff = today.diff(target, 'day')
    }

    // '오늘 포함' 체크 시 0일 기준 +1/-1
    if (include) {
      diff = diff >= 0 ? diff + 1 : diff - 1
    }

    const absDiff = Math.abs(diff)
    const todayLabel = formatDate(today)
    const targetLabel = formatDate(target)

    setResult({ todayLabel, targetLabel, diffDays: absDiff })
    setMode('result')
  }

  // '다시하기'
  const handleReset = () => {
    reset({ includeToday: false })
    setResult(null)
    setMode('none')
    setIsFrom(true) // 토글 초기 상태를 '오늘부터'로 리셋
  }

  return (
    <div>
      <TabMenu />
      {mode === 'none' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 토글 선택 안내 */}
          <div className="text-center text-gray-800">오늘부터 또는 오늘까지를 선택해주세요</div>

          {/* → 여기서 ToggleSwitch 컴포넌트를 사용 */}
         <div className="flex justify-center">
           <ToggleSwitch
             checked={isFrom}
             onChange={(val) => setIsFrom(val)}
             labelLeft="오늘부터"
             labelRight="오늘까지"
           />
         </div>

          {/* 날짜 입력 */}
          <div className="flex justify-center space-x-4 items-center">
            <div className="flex items-center space-x-1">
              <label htmlFor="year" className="sr-only">년</label>
              <input
                id="year"
                type="text"
                maxLength={4}
                placeholder="YYYY"
                {...register('year', {
                  required: '년도를 입력해주세요',
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: '4자리 숫자만',
                  },
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>년</span>
            </div>
            <div className="flex items-center space-x-1">
              <label htmlFor="month" className="sr-only">월</label>
              <input
                id="month"
                type="text"
                maxLength={2}
                placeholder="MM"
                {...register('month', {
                  required: '월을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|1[0-2]|[1-9])$/,
                    message: '1~12 사이 숫자',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>월</span>
            </div>
            <div className="flex items-center space-x-1">
              <label htmlFor="day" className="sr-only">일</label>
              <input
                id="day"
                type="text"
                maxLength={2}
                placeholder="DD"
                {...register('day', {
                  required: '일을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|[12][0-9]|3[01]|[1-9])$/,
                    message: '1~31 사이 숫자',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>일</span>
            </div>
          </div>

          {/* 오류 메시지 */}
          <div className="text-center text-sm text-red-600">
            {errors.year  && <p>{errors.year.message}</p>}
            {errors.month && <p>{errors.month.message}</p>}
            {errors.day   && <p>{errors.day.message}</p>}
          </div>

          {/* 오늘 포함 체크박스 */}
          <div className="flex justify-center items-center space-x-2">
            <input
              id="includeToday"
              type="checkbox"
              {...register('includeToday')}
              className="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-0"
            />
            <label htmlFor="includeToday" className="text-gray-700">
              오늘 포함
            </label>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col items-center space-y-3">
            <button
              type="submit"
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              계산하기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              다시하기
            </button>
          </div>
        </form>
      )}

      {mode === 'result' && result && (
        <div className="space-y-6 text-center text-gray-800">
          {/* 오늘 날짜 / 목표 날짜 */}
          <div>
            <p className="mb-2 underline">{result.todayLabel}</p>
            <p className="underline">{result.targetLabel}</p>
          </div>

          {/* 계산 결과 */}
          <div>
            <p className="mb-1">&lt;계산 결과&gt;</p>
            <p className="font-medium">D-{result.diffDays}</p>
            <p>입니다.</p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={handleReset}
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              다시하기
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              메인으로
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// src/pages/AgeDiff.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import TabMenu from '../components/TabMenu'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.locale('ko')

interface FormValues {
  year1: string; month1: string; day1: string; hour1: string; minute1: string; second1: string;
  year2: string; month2: string; day2: string; hour2: string; minute2: string; second2: string;
}

type Mode = 'none' | 'result'

interface AgeResult {
  formatted1: string
  formatted2: string
  yearDiff: number
  monthDiff: number
  dayDiff: number
  hourDiff: number
  minuteDiff: number
  secondDiff: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
}

export default function AgeDiff() {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ mode: 'onSubmit' })
  const { errors } = formState
  const [mode, setMode] = useState<Mode>('none')
  const [result, setResult] = useState<AgeResult | null>(null)
  const navigate = useNavigate()

  const formatWithDay = (d: dayjs.Dayjs): string => d.format('YYYY년 MM월 DD일 HH시 mm분 ss초(ddd)')
  const toNumberOrZero = (str: string): number => { const n = parseInt(str, 10); return isNaN(n) ? 0 : n }

  const handleReset = () => { reset(); setResult(null); setMode('none') }

  const onSubmit = (data: FormValues) => {
    const y1 = parseInt(data.year1 || '', 10)
    const mo1 = parseInt(data.month1 || '', 10)
    const d1 = parseInt(data.day1 || '', 10)
    const y2 = parseInt(data.year2 || '', 10)
    const mo2 = parseInt(data.month2 || '', 10)
    const d2 = parseInt(data.day2 || '', 10)
    if (isNaN(y1) || isNaN(mo1) || isNaN(d1)) { alert('첫 번째 사람의 생년월일(년·월·일)을 정확히 입력해주세요.'); return }
    if (isNaN(y2) || isNaN(mo2) || isNaN(d2)) { alert('두 번째 사람의 생년월일(년·월·일)을 정확히 입력해주세요.'); return }
    const h1 = toNumberOrZero(data.hour1)
    const mi1 = toNumberOrZero(data.minute1)
    const s1 = toNumberOrZero(data.second1)
    const h2 = toNumberOrZero(data.hour2)
    const mi2 = toNumberOrZero(data.minute2)
    const s2 = toNumberOrZero(data.second2)
    const validRange =
      mo1 >= 1 && mo1 <= 12 && d1 >= 1 && d1 <= 31 && h1 >= 0 && h1 <= 23 && mi1 >= 0 && mi1 <= 59 && s1 >= 0 && s1 <= 59 &&
      mo2 >= 1 && mo2 <= 12 && d2 >= 1 && d2 <= 31 && h2 >= 0 && h2 <= 23 && mi2 >= 0 && mi2 <= 59 && s2 >= 0 && s2 <= 59
    if (!validRange) { alert('날짜(월:1~12, 일:1~31) 및 시간(시:0~23, 분/초:0~59)을 확인해주세요.'); return }
    const str1 = `${String(y1).padStart(4, '0')}-${String(mo1).padStart(2, '0')}-${String(d1).padStart(2, '0')} ${String(h1).padStart(2, '0')}:${String(mi1).padStart(2, '0')}:${String(s1).padStart(2, '0')}`
    const str2 = `${String(y2).padStart(4, '0')}-${String(mo2).padStart(2, '0')}-${String(d2).padStart(2, '0')} ${String(h2).padStart(2, '0')}:${String(mi2).padStart(2, '0')}:${String(s2).padStart(2, '0')}`
    const dt1 = dayjs(str1, 'YYYY-MM-DD HH:mm:ss')
    const dt2 = dayjs(str2, 'YYYY-MM-DD HH:mm:ss')
    if (!dt1.isValid() || !dt2.isValid()) { alert('날짜/시간 형식이 올바르지 않습니다.'); return }
    let dtA = dt1, dtB = dt2
    if (dt1.isAfter(dt2)) { dtA = dt2; dtB = dt1 }
    const years = dtB.diff(dtA, 'year')
    const afterYear = dtA.add(years, 'year')
    const months = dtB.diff(afterYear, 'month')
    const afterMonth = afterYear.add(months, 'month')
    const days = dtB.diff(afterMonth, 'day')
    const afterDay = afterMonth.add(days, 'day')
    const hours = dtB.diff(afterDay, 'hour')
    const afterHour = afterDay.add(hours, 'hour')
    const minutes = dtB.diff(afterHour, 'minute')
    const afterMinute = afterHour.add(minutes, 'minute')
    const seconds = dtB.diff(afterMinute, 'second')
    const totalSec = Math.abs(dtB.diff(dtA, 'second'))
    const totalMin = Math.floor(totalSec / 60)
    const totalHr = Math.floor(totalMin / 60)
    const totalDay = Math.floor(totalHr / 24)
    const formatted1 = formatWithDay(dtA)
    const formatted2 = formatWithDay(dtB)
    setResult({
      formatted1, formatted2,
      yearDiff: years, monthDiff: months, dayDiff: days,
      hourDiff: hours, minuteDiff: minutes, secondDiff: seconds,
      totalDays: totalDay, totalHours: totalHr,
      totalMinutes: totalMin, totalSeconds: totalSec,
    })
    setMode('result')
  }

  const InputGroup = ({
    prefix,
  }: { prefix: '1' | '2' }) => (
    <div className="flex flex-col items-center space-y-1 w-full">
      {/* 년/월/일 */}
      <div className="flex flex-row justify-center items-center space-x-2 w-full">
        <div className="flex items-center space-x-1">
          <input
            id={`year${prefix}`}
            type="text"
            maxLength={4}
            placeholder="YYYY"
            {...register(`year${prefix}` as keyof FormValues, {
              required: '연도를 입력해주세요',
              pattern: { value: /^[0-9]{4}$/, message: '4자리 숫자로 입력' },
            })}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>년</span>
        </div>
        <div className="flex items-center space-x-1">
          <input
            id={`month${prefix}`}
            type="text"
            maxLength={2}
            placeholder="MM"
            {...register(`month${prefix}` as keyof FormValues, {
              required: '월을 입력해주세요',
              pattern: { value: /^(0[1-9]|1[0-2]|[1-9])$/, message: '1~12 사이 숫자' },
            })}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>월</span>
        </div>
        <div className="flex items-center space-x-1">
          <input
            id={`day${prefix}`}
            type="text"
            maxLength={2}
            placeholder="DD"
            {...register(`day${prefix}` as keyof FormValues, {
              required: '일을 입력해주세요',
              pattern: { value: /^(0[1-9]|[12][0-9]|3[01]|[1-9])$/, message: '1~31 사이 숫자' },
            })}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>일</span>
        </div>
      </div>
      {/* 시/분/초 */}
      <div className="flex flex-row justify-center items-center space-x-2 w-full">
        <div className="flex items-center space-x-1">
          <input
            id={`hour${prefix}`}
            type="text"
            maxLength={2}
            placeholder="HH"
            {...register(`hour${prefix}` as keyof FormValues, {
              pattern: { value: /^([01]?[0-9]|2[0-3])$/, message: '0~23 숫자 또는 빈칸' },
            })}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>시</span>
        </div>
        <div className="flex items-center space-x-1">
          <input
            id={`minute${prefix}`}
            type="text"
            maxLength={2}
            placeholder="MM"
            {...register(`minute${prefix}` as keyof FormValues, {
              pattern: { value: /^([0-5]?[0-9])$/, message: '0~59 숫자 또는 빈칸' },
            })}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>분</span>
        </div>
        <div className="flex items-center space-x-1">
          <input
            id={`second${prefix}`}
            type="text"
            maxLength={2}
            placeholder="SS"
            {...register(`second${prefix}` as keyof FormValues, {
              pattern: { value: /^([0-5]?[0-9])$/, message: '0~59 숫자 또는 빈칸' },
            })}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <span>초</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <TabMenu />
      <div className="max-w-md w-full mx-auto px-2 py-6">
        {mode === 'none' && (
          <form className="space-y-8">
            {/* 1) 첫 번째 사람 */}
            <div className="flex flex-row items-start space-x-2">
              <span role="img" aria-label="person" className="mt-2">👤</span>
              <InputGroup prefix="1" />
            </div>
            {/* 2) 두 번째 사람 */}
            <div className="flex flex-row items-start space-x-2">
              <span role="img" aria-label="person" className="mt-2">👤</span>
              <InputGroup prefix="2" />
            </div>
            {/* 유효성 검사 오류 메시지 */}
            <div className="text-center text-sm text-red-600 space-y-1">
              {Object.entries(errors).map(([k, v]) =>
                v?.message ? <p key={k}>{v.message}</p> : null
              )}
            </div>
            {/* 버튼 그룹 */}
            <div className="flex flex-col items-center space-y-3">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="w-full sm:w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
              >
                차이 계산하기
              </button>
              <button
                type="button"
                onClick={() => reset()}
                className="w-full sm:w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
              >
                다시하기
              </button>
            </div>
          </form>
        )}

        {mode === 'result' && result && (
          <div className="space-y-6 text-center text-gray-800">
            <div>
              <p className="mb-2 underline">{result.formatted1}</p>
              <p className="underline">{result.formatted2}</p>
            </div>
            <div>
              <p className="mb-1">&lt;계산 결과&gt;</p>
              <p className="font-medium">
                {`${result.yearDiff}년 ${result.monthDiff}개월 ${result.dayDiff}일 ${result.hourDiff}시 ${result.minuteDiff}분 ${result.secondDiff}초`}
              </p>
            </div>
            <div>
              <p>{`총 ${result.totalDays}일`}</p>
              <p>{`총 ${result.totalHours}시간`}</p>
              <p>{`총 ${result.totalMinutes}분`}</p>
              <p>{`총 ${result.totalSeconds}초`}</p>
              <p className="mt-2">차이입니다</p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={handleReset}
                className="w-full sm:w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
              >
                다시하기
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
              >
                메인으로
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

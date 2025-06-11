// src/pages/AgeCalc.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import TabMenu from '../components/TabMenu'

dayjs.extend(customParseFormat)
dayjs.locale('ko')

interface FormValues {
  year: string
  month: string
  day: string
  hour: string   // 선택사항
  minute: string // 선택사항
  second: string // 선택사항
}

type Mode = 'none' | 'result'

interface AgeResult {
  formattedDOB: string
  koreanAge: number
  intlAge: number
  zodiac: string
}

export default function AgeCalc() {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ mode: 'onSubmit' })
  const { errors } = formState

  // 현재 화면 모드(입력/결과)와 결과 값 상태 관리
  const [mode, setMode] = useState<Mode>('none')
  const [result, setResult] = useState<AgeResult | null>(null)
  const navigate = useNavigate()

  // “YYYY년 MM월 DD일 HH시 mm분 ss초(요일)” 형태 포맷
  const formatWithDay = (d: dayjs.Dayjs): string => {
    return d.format('YYYY년 MM월 DD일 HH시 mm분 ss초(ddd)')
  }

  // 입력값이 빈칸이면 0으로 변환
  const toNumberOrZero = (str: string): number => {
    const n = parseInt(str, 10)
    return isNaN(n) ? 0 : n
  }

  // 출생 띠(12간지) 계산 (입춘 기준)
  const getZodiac = (year: number, month: number, day: number): string => {
    const ipchun = dayjs(`${year}-02-04`, 'YYYY-MM-DD')
    const birthday = dayjs(
      `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      'YYYY-MM-DD'
    )
    const effectiveYear = birthday.isBefore(ipchun) ? year - 1 : year
    const animals = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지']
    let idx = (effectiveYear - 4) % 12
    if (idx < 0) idx += 12
    return `${animals[idx]}띠`
  }

  // “올해 내 나이는?” 제출 처리
  const onSubmit = (data: FormValues) => {
        // 입력값(년월일) 숫자 변환
    const y = parseInt(data.year || '', 10)
    const mo = parseInt(data.month || '', 10)
    const d = parseInt(data.day || '', 10)
    // 필수값 검증
    if (isNaN(y) || isNaN(mo) || isNaN(d)) {
      alert('생년월일(년·월·일)을 정확히 입력해주세요.')
      return
    }

    // 시분초는 빈칸이면 0으로
    const h = toNumberOrZero(data.hour)
    const mi = toNumberOrZero(data.minute)
    const s = toNumberOrZero(data.second)

    // 범위 검증
    const validRange =
      mo >= 1 && mo <= 12 &&
      d >= 1 && d <= 31 &&
      h >= 0 && h <= 23 &&
      mi >= 0 && mi <= 59 &&
      s >= 0 && s <= 59
    if (!validRange) {
      alert('월(1~12), 일(1~31), 시(0~23), 분/초(0~59)를 확인해주세요.')
      return
    }

    // 입력값을 dayjs 객체로 변환
    const dobStr = `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ` +
                   `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    const dob = dayjs(dobStr, 'YYYY-MM-DD HH:mm:ss')
    if (!dob.isValid()) {
      alert('날짜/시간 형식이 올바르지 않습니다.')
      return
    }
    // 올해 날짜 객체
    const now = dayjs()
    // 한국 나이 계산 (올해-출생년도+1)
    const koreanAge = now.year() - dob.year() + 1
    // 만 나이 계산 (생일 안지났으면 -1)
    let intlAge = now.year() - dob.year()
    const thisYearBirthday = dob.set('year', now.year())
    if (now.isBefore(thisYearBirthday)) {
      intlAge -= 1
    }
    // 띠 계산
    const zodiac = getZodiac(dob.year(), dob.month() + 1, dob.date())
    // 결과 날짜 포맷
    const formattedDOB = formatWithDay(dob)
    // 결과 저장 및 결과 화면으로 전환
    setResult({ formattedDOB, koreanAge, intlAge, zodiac })
    setMode('result')
  }
  // 폼과 결과 리셋
  const handleReset = () => {
    reset()
    setResult(null)
    setMode('none')
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <TabMenu />
      <div className="max-w-md w-full mx-auto px-2 py-6">
        {mode === 'none' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 년/월/일 */}
            <div className="flex flex-row justify-center items-center space-x-2 w-full">
              {/* 년 */}
              <div className="flex items-center space-x-1">
                <label htmlFor="year" className="sr-only">년</label>
                <input
                  id="year"
                  type="text"
                  maxLength={4}
                  placeholder="YYYY"
                  {...register('year', {
                    required: '년도를 입력해주세요',
                    pattern: { value: /^[0-9]{4}$/, message: '4자리 숫자로 입력' },
                  })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>년</span>
              </div>
              {/* 월 */}
              <div className="flex items-center space-x-1">
                <label htmlFor="month" className="sr-only">월</label>
                <input
                  id="month"
                  type="text"
                  maxLength={2}
                  placeholder="MM"
                  {...register('month', {
                    required: '월을 입력해주세요',
                    pattern: { value: /^(0[1-9]|1[0-2]|[1-9])$/, message: '1~12 사이 숫자' },
                  })}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>월</span>
              </div>
              {/* 일 */}
              <div className="flex items-center space-x-1">
                <label htmlFor="day" className="sr-only">일</label>
                <input
                  id="day"
                  type="text"
                  maxLength={2}
                  placeholder="DD"
                  {...register('day', {
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
              {/* 시 (선택) */}
              <div className="flex items-center space-x-1">
                <label htmlFor="hour" className="sr-only">시</label>
                <input
                  id="hour"
                  type="text"
                  maxLength={2}
                  placeholder="HH"
                  {...register('hour', {
                    pattern: { value: /^([0-1]?[0-9]|2[0-3])$/, message: '0~23 숫자 또는 빈칸' },
                  })}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>시</span>
              </div>
              {/* 분 (선택) */}
              <div className="flex items-center space-x-1">
                <label htmlFor="minute" className="sr-only">분</label>
                <input
                  id="minute"
                  type="text"
                  maxLength={2}
                  placeholder="MM"
                  {...register('minute', {
                    pattern: { value: /^([0-5]?[0-9])$/, message: '0~59 숫자 또는 빈칸' },
                  })}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>분</span>
              </div>
              {/* 초 (선택) */}
              <div className="flex items-center space-x-1">
                <label htmlFor="second" className="sr-only">초</label>
                <input
                  id="second"
                  type="text"
                  maxLength={2}
                  placeholder="SS"
                  {...register('second', {
                    pattern: { value: /^([0-5]?[0-9])$/, message: '0~59 숫자 또는 빈칸' },
                  })}
                  className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>초</span>
              </div>
            </div>

            {/* “에 태어났습니다.” */}
            <div className="text-center text-gray-800">에 태어났습니다.</div>

            {/* 유효성 검사 오류 메시지 */}
            <div className="text-center text-sm text-red-600 space-y-1">
              {Object.entries(errors).map(([k, v]) =>
                v?.message ? <p key={k}>{v.message}</p> : null
              )}
            </div>

            {/* 버튼 그룹 */}
            <div className="flex flex-col items-center space-y-3">
              <button
                type="submit"
                className="w-full sm:w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
              >
                올해 내 나이는?
              </button>
              <button
                type="button"
                onClick={handleReset}
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
              <p className="underline mb-2">{result.formattedDOB}</p>
            </div>
            <div>
              <p className="mb-1">&lt;계산 결과&gt;</p>
              <p className="font-medium">나이 : {result.koreanAge}세</p>
              <p>만 나이 : {result.intlAge}세</p>
              <p>띠 : {result.zodiac}</p>
              <p>입니다.</p>
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

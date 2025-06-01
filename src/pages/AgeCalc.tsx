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
  const {
    register,
    handleSubmit,
    reset,
    formState,
  } = useForm<FormValues>({ mode: 'onSubmit' })
  const { errors } = formState

  const [mode, setMode] = useState<Mode>('none')
  const [result, setResult] = useState<AgeResult | null>(null)
  const navigate = useNavigate()

  // “YYYY년 MM월 DD일 HH시 mm분 ss초(요일)” 형태 포맷
  const formatWithDay = (d: dayjs.Dayjs): string => {
    return d.format('YYYY년 MM월 DD일 HH시 mm분 ss초(ddd)')
  }

  // 빈칸 → 0으로 처리
  const toNumberOrZero = (str: string): number => {
    const n = parseInt(str, 10)
    return isNaN(n) ? 0 : n
  }

  /**
   * 띠를 계산하는 헬퍼
   *  - 양력 2월 4일(입춘) 이전이면 (year - 1)년 기준 띠,
   *  - 2월 4일 또는 이후면 year년 기준 띠를 사용.
   *  - 띠 순서(쥐→소→호랑이→토끼→용→뱀→말→양→원숭이→닭→개→돼지)
   *  - 공식을 간단히: idx = (effectiveYear - 4) % 12
   */
  const getZodiac = (year: number, month: number, day: number): string => {
    // 해당 연도의 입춘(2월 4일)
    const ipchun = dayjs(`${year}-02-04`, 'YYYY-MM-DD')
    // 사용자가 입력한 생일
    const birthday = dayjs(
      `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      'YYYY-MM-DD'
    )

    // 입춘 이전이라면 effectiveYear = year - 1
    // 입춘 당일(2/4)부터는 effectiveYear = year
    const effectiveYear = birthday.isBefore(ipchun) ? year - 1 : year

    // 띠 배열 (idx 0=쥐, 1=소, 2=호랑이, …)
    const animals = [
      '쥐',     // 0
      '소',     // 1
      '호랑이', // 2
      '토끼',   // 3
      '용',     // 4
      '뱀',     // 5
      '말',     // 6
      '양',     // 7
      '원숭이', // 8
      '닭',     // 9
      '개',     // 10
      '돼지',   // 11
    ]

    // (effectiveYear - 4) % 12 이 0이면 쥐띠, 1이면 소띠, … 
    let idx = (effectiveYear - 4) % 12
    if (idx < 0) idx += 12
    return `${animals[idx]}띠`
  }

  // “올해 내 나이는?” 제출 처리
  const onSubmit = (data: FormValues) => {
    // 1) 필수: year, month, day
    const y = parseInt(data.year || '', 10)
    const mo = parseInt(data.month || '', 10)
    const d = parseInt(data.day || '', 10)

    if (isNaN(y) || isNaN(mo) || isNaN(d)) {
      alert('생년월일(년·월·일)을 정확히 입력해주세요.')
      return
    }

    // 2) 선택: 시간 → 빈칸이면 0
    const h = toNumberOrZero(data.hour)
    const mi = toNumberOrZero(data.minute)
    const s = toNumberOrZero(data.second)

    // 3) 범위 검사: 월 1~12, 일 1~31, 시 0~23, 분/초 0~59
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

    // 4) dayjs 파싱 (시간 빈칸이면 “00:00:00”)
    const dobStr = `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ` +
                   `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    const dob = dayjs(dobStr, 'YYYY-MM-DD HH:mm:ss')

    if (!dob.isValid()) {
      alert('날짜/시간 형식이 올바르지 않습니다.')
      return
    }

    const now = dayjs()

    // 5) 한국나이 = 현재 연도 - 출생 연도 + 1
    const koreanAge = now.year() - dob.year() + 1

    // 6) 만 나이 = 현재 연도 - 출생 연도, 단 “생일이 아직 지나지 않았다면 -1”
    let intlAge = now.year() - dob.year()
    const thisYearBirthday = dob.set('year', now.year())
    if (now.isBefore(thisYearBirthday)) {
      intlAge -= 1
    }

    // 7) 띠 계산 (입춘 기준)
    const zodiac = getZodiac(dob.year(), dob.month() + 1, dob.date())
    // ※ dayjs.month()는 0-11 반환하므로, month()+1로 1-12 형태 사용

    // 8) 화면에 보여줄 포맷된 생년월일(요일 포함)
    const formattedDOB = formatWithDay(dob)

    setResult({ formattedDOB, koreanAge, intlAge, zodiac })
    setMode('result')
  }

  // “다시하기”
  const handleReset = () => {
    reset()
    setResult(null)
    setMode('none')
  }

  return (
    <div>
      <TabMenu />
      {mode === 'none' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-4 items-center">
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
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: '4자리 숫자로 입력',
                  },
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
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
                  pattern: {
                    value: /^(0[1-9]|1[0-2]|[1-9])$/,
                    message: '1~12 사이 숫자',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
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
                  pattern: {
                    value: /^(0[1-9]|[12][0-9]|3[01]|[1-9])$/,
                    message: '1~31 사이 숫자',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>일</span>
            </div>

            {/* 시 (선택) */}
            <div className="flex items-center space-x-1">
              <label htmlFor="hour" className="sr-only">시</label>
              <input
                id="hour"
                type="text"
                maxLength={2}
                placeholder="HH"
                {...register('hour', {
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3])$/,
                    message: '0~23 숫자 또는 빈칸',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
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
                  pattern: {
                    value: /^([0-5]?[0-9])$/,
                    message: '0~59 숫자 또는 빈칸',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
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
                  pattern: {
                    value: /^([0-5]?[0-9])$/,
                    message: '0~59 숫자 또는 빈칸',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>초</span>
            </div>
          </div>

          {/* “에 태어났습니다.” */}
          <div className="text-center text-gray-800">에 태어났습니다.</div>

          {/* 유효성 검사 오류 메시지 */}
          <div className="text-center text-sm text-red-600">
            {errors.year   && <p>{errors.year.message}</p>}
            {errors.month  && <p>{errors.month.message}</p>}
            {errors.day    && <p>{errors.day.message}</p>}
            {errors.hour   && <p>{errors.hour.message}</p>}
            {errors.minute && <p>{errors.minute.message}</p>}
            {errors.second && <p>{errors.second.message}</p>}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col items-center space-y-3">
            <button
              type="submit"
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              올해 내 나이는?
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
          {/* 생년월일(요일 포함) */}
          <div>
            <p className="underline mb-2">{result.formattedDOB}</p>
          </div>

          {/* 계산 결과 */}
          <div>
            <p className="mb-1">&lt;계산 결과&gt;</p>
            <p className="font-medium">나이 : {result.koreanAge}세</p>
            <p>만 나이 : {result.intlAge}세</p>
            <p>띠 : {result.zodiac}</p>
            <p>입니다.</p>
          </div>

          {/* 버튼 그룹 (다시하기 / 메인으로) */}
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

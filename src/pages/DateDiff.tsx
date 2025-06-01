// src/pages/DateDiff.tsx
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
  startYear: string
  startMonth: string
  startDay: string
  endYear: string
  endMonth: string
  endDay: string
}

interface DifferenceResult {
  formattedStart: string
  formattedEnd: string
  yearDiff: number
  monthDiff: number
  dayDiff: number
  totalDays: number
}

export default function DateDiff() {
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const { errors } = formState
  const [result, setResult] = useState<DifferenceResult | null>(null)
  const navigate = useNavigate()

  // 계산 로직
  const onSubmit = (data: FormValues) => {
    const { startYear, startMonth, startDay, endYear, endMonth, endDay } = data

    // 입력값을 YYYY-MM-DD 형태의 문자열로 합치기
    const startDateStr = `${startYear.padStart(4, '0')}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`
    const endDateStr = `${endYear.padStart(4, '0')}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`

    // dayjs로 파싱 (한국어 요일 포함)
    const startDate = dayjs(startDateStr, 'YYYY-MM-DD')
    const endDate = dayjs(endDateStr, 'YYYY-MM-DD')

    if (!startDate.isValid() || !endDate.isValid()) {
      alert('유효한 날짜를 입력해주세요.')
      return
    }

    // 두 날짜 중 앞/뒤를 정렬: start ≤ end가 되도록
    let a = startDate
    let b = endDate
    if (startDate.isAfter(endDate)) {
      a = endDate
      b = startDate
    }

    // 각각 “YYYY년 MM월 DD일(ddd)” 형식으로 포맷
    const formattedStart = a.format('YYYY년 MM월 DD일(ddd)')
    const formattedEnd = b.format('YYYY년 MM월 DD일(ddd)')

    // 연ㆍ월ㆍ일 단위 차이 계산
    const years = b.diff(a, 'year')
    const afterYearAdd = a.add(years, 'year')
    const months = b.diff(afterYearAdd, 'month')
    const afterMonthAdd = afterYearAdd.add(months, 'month')
    const days = b.diff(afterMonthAdd, 'day')

    // 총 일수 차이 (절댓값)
    const totalDays = Math.abs(b.diff(a, 'day'))

    setResult({
      formattedStart,
      formattedEnd,
      yearDiff: years,
      monthDiff: months,
      dayDiff: days,
      totalDays,
    })
  }

  // “다시하기” 클릭: 폼 & 결과 초기화
  const handleReset = () => {
    reset()
    setResult(null)
  }

  return (
    <div>
      <TabMenu />
      {/** 결과가 없으면 입력 폼을 보여주고, 결과가 있으면 결과 화면을 보여줍니다 */}
      {result === null ? (
        // 입력 폼 영역
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-4">
            {/* 첫 번째 날짜 입력: 연-월-일 */}
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={4}
                placeholder="YYYY"
                {...register('startYear', {
                  required: '년도를 입력해주세요',
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: '4자리 연도로 입력해주세요',
                  },
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>년</span>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={2}
                placeholder="MM"
                {...register('startMonth', {
                  required: '월을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|1[0-2]|[1-9])$/,
                    message: '1~12 사이의 숫자로 입력해주세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>월</span>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={2}
                placeholder="DD"
                {...register('startDay', {
                  required: '일을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|[12][0-9]|3[01]|[1-9])$/,
                    message: '1~31 사이의 숫자로 입력해주세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>일</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {/* 두 번째 날짜 입력: 연-월-일 */}
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={4}
                placeholder="YYYY"
                {...register('endYear', {
                  required: '년도를 입력해주세요',
                  pattern: {
                    value: /^[0-9]{4}$/,
                    message: '4자리 연도로 입력해주세요',
                  },
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>년</span>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={2}
                placeholder="MM"
                {...register('endMonth', {
                  required: '월을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|1[0-2]|[1-9])$/,
                    message: '1~12 사이의 숫자로 입력해주세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>월</span>
            </div>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                maxLength={2}
                placeholder="DD"
                {...register('endDay', {
                  required: '일을 입력해주세요',
                  pattern: {
                    value: /^(0[1-9]|[12][0-9]|3[01]|[1-9])$/,
                    message: '1~31 사이의 숫자로 입력해주세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>일</span>
            </div>
          </div>

          {/* 유효성 검사 오류 메시지 */}
          <div className="text-center text-sm text-red-600">
            {errors.startYear && <p>{errors.startYear.message}</p>}
            {errors.startMonth && <p>{errors.startMonth.message}</p>}
            {errors.startDay && <p>{errors.startDay.message}</p>}
            {errors.endYear && <p>{errors.endYear.message}</p>}
            {errors.endMonth && <p>{errors.endMonth.message}</p>}
            {errors.endDay && <p>{errors.endDay.message}</p>}
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
      ) : (
        // 결과 화면 영역
        <div className="space-y-6 text-center text-gray-800">
          {/* 입력한 두 날짜와 요일 */}
          <div>
            <p className="mb-2 underline">{result.formattedStart}</p>
            <p className="underline">{result.formattedEnd}</p>
          </div>

          {/* 계산 결과 */}
          <div>
            <p className="mb-1">{`<계산 결과>`}</p>
            <p className="font-medium">
              {`${result.yearDiff}년 ${result.monthDiff}개월 ${result.dayDiff}일`}
            </p>
            <p>{`또는 총 ${result.totalDays}일`}</p>
            <p>차이입니다</p>
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

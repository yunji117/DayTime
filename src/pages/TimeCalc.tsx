// src/pages/TimeCalc.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import TabMenu from '../components/TabMenu'

interface FormValues {
  baseHour: string
  baseMinute: string
  baseSecond: string
  targetHour: string
  targetMinute: string
  targetSecond: string
}

type Mode = 'none' | 'plus' | 'diff'

interface PlusResult {
  baseLabel: string
  targetLabel: string
  resultLabel: string
}

interface DiffResult {
  baseLabel: string
  targetLabel: string
  diffLabel: string
}

export default function TimeCalc() {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    setValue, 
  } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const { errors } = formState
  const [mode, setMode] = useState<Mode>('none')
  const [plusResult, setPlusResult] = useState<PlusResult | null>(null)
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
  const navigate = useNavigate()

  // “오전/오후 HH시 MM분 SS초” 형태 포맷
  const formatWithAmPm = (dateObj: dayjs.Dayjs): string => {
    const hour = dateObj.hour()
    const minute = dateObj.minute()
    const second = dateObj.second()
    const isPM = hour >= 12
    const label = isPM ? '오후' : '오전'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    const hh = String(hour12).padStart(2, '0')
    const mm = String(minute).padStart(2, '0')
    const ss = String(second).padStart(2, '0')
    return `${label} ${hh}시 ${mm}분 ${ss}초`
  }

  // “HH시 MM분 SS초” 형태 포맷 (차이용)
  const formatHMS = (h: number, m: number, s: number): string => {
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const ss = String(s).padStart(2, '0')
    return `${hh}시 ${mm}분 ${ss}초`
  }

  // “후 계산하기” 모드
  const onSubmitPlus = (data: FormValues) => {
    const {
      baseHour,
      baseMinute,
      baseSecond,
      targetHour,
      targetMinute,
      targetSecond,
    } = data

    // 기준 시간 필드는 여전히 필수
    const bH = parseInt(baseHour || '0', 10)
    const bM = parseInt(baseMinute || '0', 10)
    const bS = parseInt(baseSecond || '0', 10)

    // 추가할 시간은 빈 문자열 → 0으로 처리
    const tH = parseInt(targetHour || '0', 10)
    const tM = parseInt(targetMinute || '0', 10)
    const tS = parseInt(targetSecond || '0', 10)

    // 유효성 검사: 기준 시간
    if (
      isNaN(bH) || isNaN(bM) || isNaN(bS) ||
      bH < 0 || bH > 23 ||
      bM < 0 || bM > 59 ||
      bS < 0 || bS > 59
    ) {
      alert('기준 시간은 0~23(시), 0~59(분/초) 사이 숫자로 입력해야 합니다.')
      return
    }

    // 유효성 검사: 추가할 시간 (범위만 검사, 빈 칸은 0으로 간주)
    if (
      isNaN(tH) || isNaN(tM) || isNaN(tS) ||
      tH < 0 || tH > 23 ||
      tM < 0 || tM > 59 ||
      tS < 0 || tS > 59
    ) {
      alert('추가할 시간도 0~23(시), 0~59(분/초) 사이 숫자로 입력하거나 비워두세요.')
      return
    }

    // 기준 시간: 오늘 날짜를 기준으로 HH:mm:ss 설정
    const baseDate = dayjs()
      .hour(bH)
      .minute(bM)
      .second(bS)
      .millisecond(0)

    // 추가할 시간: 기준 시간에 더하기
    const added = baseDate
      .add(tH, 'hour')
      .add(tM, 'minute')
      .add(tS, 'second')

    const baseLabel = formatWithAmPm(baseDate)
    const targetLabel = formatHMS(tH, tM, tS)
    const resultLabel = formatWithAmPm(added)

    setPlusResult({ baseLabel, targetLabel, resultLabel })
    setDiffResult(null)
    setMode('plus')
  }

  // “차이 계산하기” 모드
  const onSubmitDiff = (data: FormValues) => {
    const {
      baseHour,
      baseMinute,
      baseSecond,
      targetHour,
      targetMinute,
      targetSecond,
    } = data

    const bH = parseInt(baseHour || '0', 10)
    const bM = parseInt(baseMinute || '0', 10)
    const bS = parseInt(baseSecond || '0', 10)
    const tH = parseInt(targetHour || '0', 10)
    const tM = parseInt(targetMinute || '0', 10)
    const tS = parseInt(targetSecond || '0', 10)

    // 유효성 검사: 기준/비교 시간 모두 필수
    if (
      isNaN(bH) || isNaN(bM) || isNaN(bS) ||
      bH < 0 || bH > 23 ||
      bM < 0 || bM > 59 ||
      bS < 0 || bS > 59 ||
      isNaN(tH) || isNaN(tM) || isNaN(tS) ||
      tH < 0 || tH > 23 ||
      tM < 0 || tM > 59 ||
      tS < 0 || tS > 59
    ) {
      alert('비교 모드에서는 두 시각 모두(시/분/초) 반드시 0~23(시), 0~59(분/초) 사이 숫자로 입력해야 합니다.')
      return
    }

    const dateA = dayjs().hour(bH).minute(bM).second(bS).millisecond(0)
    const dateB = dayjs().hour(tH).minute(tM).second(tS).millisecond(0)

    let earlier = dateA
    let later = dateB
    if (dateA.isAfter(dateB)) {
      earlier = dateB
      later = dateA
    }

    const diffSeconds = later.diff(earlier, 'second')
    const hours = Math.floor(diffSeconds / 3600)
    const minutes = Math.floor((diffSeconds % 3600) / 60)
    const seconds = diffSeconds % 60

    const baseLabel = formatWithAmPm(earlier)
    const targetLabel = formatWithAmPm(later)
    const diffLabel = formatHMS(hours, minutes, seconds)

    setDiffResult({ baseLabel, targetLabel, diffLabel })
    setPlusResult(null)
    setMode('diff')
  }

  const handleReset = () => {
    reset()
    setPlusResult(null)
    setDiffResult(null)
    setMode('none')
  }

  // “지금 시간 넣기” 버튼 클릭 핸들러
  const handleFillCurrentTime = () => {
    const now = dayjs()
    const h = now.hour()
    const m = now.minute()
    const s = now.second()

    // 폼 필드에 현재 시각을 문자열로 채워줌
    setValue('baseHour', String(h).padStart(2, '0'))
    setValue('baseMinute', String(m).padStart(2, '0'))
    setValue('baseSecond', String(s).padStart(2, '0'))
  }

  return (
    <div>
      <TabMenu />
      {mode === 'none' && (
        <form className="space-y-6">
          {/* 기준 시간 입력 + “지금 시간 넣기” 버튼 */}
          <div className="flex flex-col items-center space-y-2">
            <button
              type="button"
              onClick={handleFillCurrentTime}
              className="w-40 py-1 bg-blue-400 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors mb-5"
            >
              지금 시간 넣기
            </button>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <label htmlFor="baseHour" className="sr-only">시</label>
                <input
                  id="baseHour"
                  type="text"
                  maxLength={2}
                  placeholder="HH"
                  {...register('baseHour', {
                    required: '기준 시간(시)을 입력해주세요',
                    pattern: {
                      value: /^([0-1]?[0-9]|2[0-3])$/,
                      message: '0~23 사이 숫자만 입력',
                    },
                  })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>시</span>
              </div>
              <div className="flex items-center space-x-1">
                <label htmlFor="baseMinute" className="sr-only">분</label>
                <input
                  id="baseMinute"
                  type="text"
                  maxLength={2}
                  placeholder="MM"
                  {...register('baseMinute', {
                    required: '기준 시간(분)을 입력해주세요',
                    pattern: {
                      value: /^([0-5]?[0-9])$/,
                      message: '0~59 사이 숫자만 입력',
                    },
                  })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>분</span>
              </div>
              <div className="flex items-center space-x-1">
                <label htmlFor="baseSecond" className="sr-only">초</label>
                <input
                  id="baseSecond"
                  type="text"
                  maxLength={2}
                  placeholder="SS"
                  {...register('baseSecond', {
                    required: '기준 시간(초)을 입력해주세요',
                    pattern: {
                      value: /^([0-5]?[0-9])$/,
                      message: '0~59 사이 숫자만 입력',
                    },
                  })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
                <span>초</span>
              </div>
            </div>
          </div>

          {/* === 추가할 시간 입력 (선택사항) === */}
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <label htmlFor="targetHour" className="sr-only">시</label>
              <input
                id="targetHour"
                type="text"
                maxLength={2}
                placeholder="HH"
                {...register('targetHour', {
                  pattern: {
                    value: /^([0-1]?[0-9]|2[0-3])$/,
                    message: '0~23 사이 숫자만 입력하거나 비워두세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>시</span>
            </div>
            <div className="flex items-center space-x-1">
              <label htmlFor="targetMinute" className="sr-only">분</label>
              <input
                id="targetMinute"
                type="text"
                maxLength={2}
                placeholder="MM"
                {...register('targetMinute', {
                  pattern: {
                    value: /^([0-5]?[0-9])$/,
                    message: '0~59 사이 숫자만 입력하거나 비워두세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>분</span>
            </div>
            <div className="flex items-center space-x-1">
              <label htmlFor="targetSecond" className="sr-only">초</label>
              <input
                id="targetSecond"
                type="text"
                maxLength={2}
                placeholder="SS"
                {...register('targetSecond', {
                  pattern: {
                    value: /^([0-5]?[0-9])$/,
                    message: '0~59 사이 숫자만 입력하거나 비워두세요',
                  },
                })}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
              />
              <span>초</span>
            </div>
          </div>

          {/* 유효성 검사 에러 메시지 */}
          <div className="text-center text-sm text-red-600">
            {errors.baseHour     && <p>{errors.baseHour.message}</p>}
            {errors.baseMinute   && <p>{errors.baseMinute.message}</p>}
            {errors.baseSecond   && <p>{errors.baseSecond.message}</p>}
            {errors.targetHour   && <p>{errors.targetHour.message}</p>}
            {errors.targetMinute && <p>{errors.targetMinute.message}</p>}
            {errors.targetSecond && <p>{errors.targetSecond.message}</p>}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col items-center space-y-3">
            <button
              type="button"
              onClick={handleSubmit(onSubmitPlus)}
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              후 계산하기
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmitDiff)}
              className="w-40 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-base font-medium transition-colors"
            >
              차이 계산하기
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

      {/* “후 계산하기” 결과 화면 */}
      {mode === 'plus' && plusResult && (
        <div className="space-y-6 text-center text-gray-800">
          <div>
            <p className="mb-2">{`기준 시간 : ${plusResult.baseLabel} 에서`}</p>
            <p>{`추가 시간 : ${plusResult.targetLabel} 후`}</p>
          </div>
          <div>
            <p className="mb-1">{`<계산 결과>`}</p>
            <p className="font-medium">{plusResult.resultLabel}</p>
            <p>입니다</p>
          </div>
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

      {/* “차이 계산하기” 결과 화면 */}
      {mode === 'diff' && diffResult && (
        <div className="space-y-6 text-center text-gray-800">
          <div>
            <p className="mb-2">{`기준 시간 : ${diffResult.baseLabel} 에서`}</p>
            <p>{`비교 시간 : ${diffResult.targetLabel} 까지 차이는`}</p>
          </div>
          <div>
            <p className="mb-1">{`<계산 결과>`}</p>
            <p className="font-medium">{diffResult.diffLabel}</p>
            <p>차이입니다</p>
          </div>
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

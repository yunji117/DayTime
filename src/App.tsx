// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import DateDiff from './pages/DateDiff'
import TimeCalc from './pages/TimeCalc'
import AgeDiff from './pages/AgeDiff'
import AgeCalc from './pages/AgeCalc'
import DDayCalc from './pages/DDayCalc'

export default function App() {
  return (
    <div>
    <BrowserRouter>
      {/* Layout: 헤더 + 메인 컨테이너를 정의 */}
      <Layout>
        <Routes>
          {/* path="/"을 Home으로 설정 */}
          <Route path="/" element={<Home />} />

          {/* 각각 페이지 컴포넌트를 연결 */}
          <Route path="/date-diff" element={<DateDiff />} />
          <Route path="/time-calc" element={<TimeCalc />} />
          <Route path="/age-diff" element={<AgeDiff />} />
          <Route path="/age-calc" element={<AgeCalc />} />
          <Route path="/dday-calc" element={<DDayCalc />} />

          {/* 위의 어느 라우트에도 매칭되지 않을 때 Home으로 리다이렉트 */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </div>
  )
}

// .eslintrc.cjs
// extends 항목만으로도 대부분의 문법 오류·베스트 프랙티스를 잡는 역할
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',   // TypeScript 파서를 사용
  parserOptions: {
    ecmaVersion: 2020,                   // ES2020 문법 허용
    sourceType: 'module',                // import/export 사용
    ecmaFeatures: { jsx: true },         // JSX 문법 허용
  },
  settings: {
    react: { version: 'detect' }         // 설치된 React 버전을 자동 감지
  },
  env: {
    browser: true,                       // 브라우저 전역 변수 (window, document 등) 허용
    es2021: true                          // ES2021 전역 변수 허용
  },
  extends: [
    'eslint:recommended',                // ESLint 기본 권장 룰
    'plugin:react/recommended',          // React 권장 룰
    'plugin:react-hooks/recommended',    // React Hooks 권장 룰
    'plugin:@typescript-eslint/recommended' // TypeScript 권장 룰
  ],
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  rules: {
    // 여기서 프로젝트 상황에 따라 룰을 켜고 끌 수 있음
    // 예시:
    // 'react/react-in-jsx-scope': 'off',     // React 17 이상이면 jsx 내에서 React import 안 해도 됨
    // '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 리턴 타입 안 강제
  },
}

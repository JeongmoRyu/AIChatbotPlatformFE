import typescriptEslintParser from '@typescript-eslint/parser'; // TypeScript ESLint 파서를 가져옴
import pluginReact from 'eslint-plugin-react'; // React ESLint 플러그인을 가져옴
import pluginTypescriptEslint from '@typescript-eslint/eslint-plugin'; // TypeScript ESLint 플러그인을 가져옴
import pluginReactHooks from 'eslint-plugin-react-hooks'; // React Hooks ESLint 플러그인을 가져옴
import pluginPrettier from 'eslint-plugin-prettier'; // Prettier ESLint 플러그인을 가져옴

const eslintRecommended = {
  rules: {
    'block-spacing': 'error', // 블록 사이의 공백을 강제
    'brace-style': 'error', // 중괄호 스타일을 강제
    'comma-dangle': 'error', // 후행 쉼표를 강제
    'consistent-return': 'error', // 일관된 반환 값을 강제
    'dot-notation': 'error', // 객체의 속성을 점 표기법으로 접근하도록 강제
    indent: 'error', // 들여쓰기를 강제
    'init-declarations': 'off', // 변수 선언 시 초기값을 할당하지 않도록 설정
    'key-spacing': 'error', // 객체 리터럴의 키-값 쌍 간격을 강제
    'keyword-spacing': 'error', // 키워드 주위의 공백을 강제
    'lines-around-comment': 'error', // 주석 주위의 빈 줄을 강제
    'lines-between-class-members': 'error', // 클래스 멤버 간의 빈 줄을 강제
    'max-params': 'off', // 함수 매개변수의 최대 개수를 제한하지 않음
    'no-dupe-class-members': 'error', // 클래스 멤버의 중복을 금지
    'no-empty-function': 'error', // 빈 함수를 금지
    'no-extra-parens': 'error', // 불필요한 괄호를 금지
    'no-extra-semi': 'error', // 불필요한 세미콜론을 금지
    'no-invalid-this': 'error', // 유효하지 않은 this 사용을 금지
    'no-loop-func': 'error', // 루프 내에서 함수 선언을 금지
    'no-loss-of-precision': 'error', // 정밀도 손실을 일으킬 수 있는 숫자 리터럴을 금지
    'no-magic-numbers': 'off', // 매직 넘버를 허용
    'no-restricted-imports': 'off', // 제한된 모듈을 가져오지 않도록 설정
    'no-unused-expressions': 'error', // 사용되지 않는 표현식을 금지
    'no-useless-constructor': 'error', // 불필요한 생성자를 금지
    'object-curly-spacing': 'error', // 객체 중괄호 내의 간격을 강제
    'prefer-destructuring': 'error', // 구조 분해 할당을 선호하도록 설정
    quotes: 'error', // 따옴표 스타일을 강제
    semi: 'error', // 세미콜론 사용을 강제
    'space-before-blocks': 'error', // 블록 앞의 공백을 강제
    'space-infix-ops': 'error', // 중위 연산자 주위의 공백을 강제
  },
};

const reactRecommended = {
  plugins: {
    react: pluginReact, // React 플러그인 추가
  },
  rules: {
    'react/react-in-jsx-scope': 'off', // React가 JSX 범위 내에 있어야 하는 규칙 비활성화
    'react/jsx-uses-react': 'off', // React가 JSX에서 사용되었는지 확인하는 규칙 비활성화
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }], // .jsx 및 .tsx 확장자를 허용
  },
  settings: {
    react: {
      version: 'detect', // 설치된 React 버전을 자동으로 감지
    },
  },
};

const typescriptRecommended = {
  plugins: {
    '@typescript-eslint': pluginTypescriptEslint, // TypeScript ESLint 플러그인 추가
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 명시적인 모듈 경계 유형을 비활성화
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용되지 않는 변수를 에러로 처리하며, _로 시작하는 변수는 예외
  },
  languageOptions: {
    parser: typescriptEslintParser, // TypeScript ESLint 파서 설정
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // JSX 사용 가능
      },
      ecmaVersion: 'latest', // 최신 ECMAScript 버전 사용
      sourceType: 'module', // 모듈 소스 타입 설정
      project: './tsconfig.json', // TypeScript 프로젝트 설정 파일
    },
  },
};

const reactHooksRecommended = {
  plugins: {
    'react-hooks': pluginReactHooks, // React Hooks 플러그인 추가
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error', // Hook 규칙을 강제
    'react-hooks/exhaustive-deps': 'warn', // 의존성 배열을 강제
  },
};

const prettierRecommended = {
  plugins: {
    prettier: pluginPrettier, // Prettier 플러그인 추가
  },
  rules: {
    'prettier/prettier': 'error', // Prettier 규칙을 강제
  },
};

export default [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}', '*.{ts,tsx,js,jsx}'], // 포함할 파일 설정
    languageOptions: {
      parser: typescriptEslintParser, // TypeScript ESLint 파서 설정
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // JSX 사용 가능
        },
        ecmaVersion: 'latest', // 최신 ECMAScript 버전 사용
        sourceType: 'module', // 모듈 소스 타입 설정
        project: './tsconfig.json', // TypeScript 프로젝트 설정 파일
      },
      globals: {
        browser: true, // 브라우저 전역 변수 설정
        es2021: true, // ES2021 전역 변수 설정
        node: false, // Node 전역 변수 비활성화
      },
    },
    plugins: {
      react: pluginReact, // React 플러그인 추가
      '@typescript-eslint': pluginTypescriptEslint, // TypeScript ESLint 플러그인 추가
      'react-hooks': pluginReactHooks, // React Hooks 플러그인 추가
      prettier: pluginPrettier, // Prettier 플러그인 추가
    },
    ...eslintRecommended, // ESLint 권장 규칙 추가
    ...reactRecommended, // React 권장 규칙 추가
    ...typescriptRecommended, // TypeScript 권장 규칙 추가
    ...reactHooksRecommended, // React Hooks 권장 규칙 추가
    ...prettierRecommended, // Prettier 권장 규칙 추가
    ignores: ['node_modules/', 'build/', '*.config.*', '.prettierrc.cjs', 'eslint.config.js'], // 무시할 경로 설정
  },
  {
    files: ['prettier-actions.js'], // 포함할 파일 설정
    languageOptions: {
      parserOptions: {
        project: null, // 프로젝트 설정 파일 사용 안 함
      },
    },
  },
];

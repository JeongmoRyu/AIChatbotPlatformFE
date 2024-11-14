// .prettierrc.cjs
module.exports = {
  printWidth: 120, // 가독성을 위해 soft wrap max-width기준을 120으로 함
  tabWidth: 2, // 들여쓰기 수준 당 공백 수 2
  useTabs: false, // 들여쓰기는 탭 대신 공백으로 함
  semi: true, // 명령문은 항상 세미콜론으로 마무리 함
  singleQuote: true, // 큰 따옴표 대신 작은 따옴표 사용
  bracketSpacing: true, // 객체 리터럴의 대괄호 사이에 공백 추가
  bracketSameLine: false, // 여러 줄의 HTML 프로퍼티 작성 후 '>'를 다음 줄에 작성함
  arrowParens: 'always', // 화살표 함수에서 항상 괄호 사용
  endOfLine: 'lf', // 줄 끝 문자를 \n으로 함
};

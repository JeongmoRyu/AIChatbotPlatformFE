import { exec } from 'child_process';
import readline from 'readline';

/**
 * runPrettierCheck 함수는 Prettier를 사용하여 코드 스타일 검사를 실행합니다.
 * @returns Promise<boolean> - 코드 스타일 문제가 발견되면 true, 그렇지 않으면 false를 반환합니다.
 */
function runPrettierCheck() {
  return new Promise((resolve) => {
    exec('prettier --check .', (error, stdout) => {
      if (error) {
        console.log(stdout);
        resolve(true); // 코드 스타일 문제가 발견됨
      } else {
        console.log('All files are formatted correctly.');
        resolve(false); // 코드 스타일 문제가 없음
      }
    });
  });
}

/**
 * runPrettierFix 함수는 Prettier를 사용하여 코드 스타일 문제를 자동으로 수정합니다.
 * @returns Promise<void> - 문제가 수정되면 resolve를 호출합니다.
 */
function runPrettierFix() {
  return new Promise((resolve, reject) => {
    exec('prettier --write .', (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
        reject(error); // 오류 발생 시 reject 호출
      } else {
        console.log(stdout);
        resolve(); // 문제가 수정되면 resolve 호출
      }
    });
  });
}

/**
 * main 함수는 Prettier 체크 및 수정 프로세스를 관리합니다.
 * 사용자에게 수정할지 여부를 물어봅니다.
 */
async function main() {
  const hasIssues = await runPrettierCheck();
  if (hasIssues) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Would you like to fix the issues? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await runPrettierFix();
        console.log('All issues have been fixed.');
      } else {
        console.log('No changes have been made.');
      }
      rl.close();
    });
  }
}

// main 함수 호출
main();

import fs from 'fs';
import path from 'path';
import os from 'os';
import type { Page } from 'playwright';
import type { ScreenshotService } from '@/types/index.js';

export class ScreenshotServiceImpl implements ScreenshotService {
  async saveErrorScreenshot(page: Page, error: Error) {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0] ?? 'unknown-date'; // YYYY-MM-DD
      const timeStamp =
        now.toISOString().replace(/[:.]/g, '-').split('.')[0] ?? 'unknown-time'; // YYYY-MM-DDTHH-MM-SS

      // 바탕화면 경로 구하기
      const desktopPath = path.join(os.homedir(), 'Desktop');
      const testFolder = path.join(desktopPath, '온라인테스트');
      const todayFolder = path.join(testFolder, today);

      // 폴더 생성 (존재하지 않으면)
      if (!fs.existsSync(testFolder)) {
        fs.mkdirSync(testFolder, { recursive: true });
      }
      if (!fs.existsSync(todayFolder)) {
        fs.mkdirSync(todayFolder, { recursive: true });
      }

      // 스크린샷 파일명
      const screenshotPath = path.join(todayFolder, `${timeStamp}.png`);

      // 스크린샷 저장
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      // eslint-disable-next-line no-console
      console.log(`에러 스크린샷 저장 완료: ${screenshotPath}`);
      // eslint-disable-next-line no-console
      console.log(`에러 내용: ${error.message}`);

      // 에러 정보도 텍스트 파일로 저장
      const errorLogPath = path.join(todayFolder, `${timeStamp}_error.txt`);
      const errorInfo = `에러 발생 시간: ${now.toISOString()}
에러 메시지: ${error.message}
에러 스택: ${error.stack ?? 'No stack trace available'}`;
      fs.writeFileSync(errorLogPath, errorInfo);
    } catch (screenshotError) {
      // eslint-disable-next-line no-console
      console.error('스크린샷 저장 중 에러 발생:', screenshotError);
    }
  }
}

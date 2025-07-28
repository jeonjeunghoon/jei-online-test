import type { Page } from 'playwright';
import type { Logger } from '@/types/index.js';

export class LoggerService implements Logger {
  async log(page: Page, message: string, isBrowserLog = true) {
    // eslint-disable-next-line no-console
    console.log(message);
    if (isBrowserLog) {
      await page.evaluate(
        msg => console.log(`=== 브라우저 콘솔: ${msg} ===`),
        message
      );
    }
  }

  error(message: string, error?: Error) {
    // eslint-disable-next-line no-console
    console.error(message, error);
  }
}

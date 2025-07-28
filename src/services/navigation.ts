import type { Page } from 'playwright';
import type { Config, NavigationService, Logger } from '@/types/index.js';
import { delay } from '@/utils/delay.js';

export class NavigationServiceImpl implements NavigationService {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger
  ) {}

  async waitForElement(
    page: Page,
    selector: string,
    timeout = this.config.TIMEOUTS.ELEMENT_WAIT
  ) {
    try {
      await page.locator(selector).waitFor({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async clickElementWithRetry(page: Page, selector: string, context = '') {
    const element = page.locator(selector);
    const exists = await element.count();

    if (exists > 0) {
      await element.click();
      await delay(this.config.DELAYS.AFTER_CLICK);
      await this.logger.log(page, `${context} 요소 클릭 완료`);
      return true;
    }

    await this.logger.log(page, `${context} 요소를 찾을 수 없음`);
    return false;
  }

  async clickTextButton(page: Page, text: string) {
    await page.getByText(text, { exact: false }).click();
    await delay(this.config.DELAYS.AFTER_CLICK);
  }

  async navigateToUrl(page: Page, url: string) {
    await page.goto(url, { timeout: this.config.TIMEOUTS.PAGE_LOAD });
  }
}

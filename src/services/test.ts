import type { Page } from 'playwright';
import type {
  Config,
  TestService,
  NavigationService,
  Logger,
} from '@/types/index.js';
import { delay } from '@/utils/delay.js';

export class TestServiceImpl implements TestService {
  constructor(
    private readonly config: Config,
    private readonly navigation: NavigationService,
    private readonly logger: Logger
  ) {}

  async testSubject(page: Page, subject: string, continueUntilEnd = false) {
    await this.navigation.clickTextButton(page, subject);
    await this.navigation.clickTextButton(page, '선택');
    await this.selectRandomListItem(page);
    await this.navigation.clickTextButton(page, '다음');

    const button = page.locator('main button').first();
    await button.click();
    await delay(this.config.DELAYS.AFTER_CLICK);

    await this.navigation.clickTextButton(page, '확인');
    await this.navigation.clickTextButton(page, '시작하기');

    await this.clickNavigationButtons(page, subject);
    await this.clickStartLink(page);
    await this.clickMainNavigationButtons(page, subject);
    await this.submitTest(page, continueUntilEnd);
  }

  async submitTest(page: Page, continueUntilEnd = false) {
    await this.navigation.clickTextButton(page, '제출 전 확인하기');
    await this.navigation.clickTextButton(page, '전체 보기');
    await this.navigation.clickTextButton(page, '제출하기');

    if (!continueUntilEnd) {
      await this.navigation.clickTextButton(page, '나중에 이어하기');
    }
  }

  async retryTest(page: Page) {
    await this.logger.log(page, '=== 다시하기 테스트 시작 ===');

    await this.navigation.clickTextButton(page, '시작하기');
    await this.clickNavigationButtons(page, '재시작');
    await this.clickStartLink(page);
    await this.clickMainNavigationButtons(page, '재시작');
    await this.submitTest(page, false);

    await this.logger.log(page, '=== 다시하기 테스트 완료 ===');
  }

  private async selectRandomListItem(page: Page) {
    const items = await page.locator('ul li:not(:has-text("선택"))').all();
    if (items.length > 0) {
      const randomIndex = Math.floor(Math.random() * items.length);
      await items[randomIndex]?.click();
      await delay(this.config.DELAYS.AFTER_CLICK);
    }
  }

  private async clickNavigationButtons(page: Page, subject: string) {
    const buttons = page.locator(this.config.SELECTORS.NAVIGATION_BUTTONS);
    let clickCount = 0;

    while (true) {
      try {
        await buttons.nth(1).click({ timeout: this.config.TIMEOUTS.CLICK });
        await delay(this.config.DELAYS.AFTER_CLICK);
        clickCount++;
        await this.logger.log(page, `${subject} 버튼 클릭 ${clickCount}번째`);
        await delay(this.config.DELAYS.CLICK_INTERVAL);
      } catch {
        await this.logger.log(
          page,
          `${subject} 버튼 클릭 완료 - 총 ${clickCount}번 클릭됨`
        );
        break;
      }
    }
  }

  private async clickStartLink(page: Page) {
    await this.navigation.clickElementWithRetry(
      page,
      this.config.SELECTORS.START_LINK,
      '시작하기 링크'
    );
  }

  private async clickMainNavigationButtons(page: Page, context = '') {
    let clickCount = 0;

    while (true) {
      try {
        const mainExists = await page.locator('main').count();
        if (mainExists === 0) break;

        const lastDivExists = await page
          .locator('main > div:last-child')
          .count();
        if (lastDivExists === 0) break;

        const button = page.locator(
          this.config.SELECTORS.MAIN_NAVIGATION_BUTTON
        );
        const targetButtonCount = await button.count();

        if (targetButtonCount === 0) break;

        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();

        if (isVisible && isEnabled) {
          await button.click();
          await delay(this.config.DELAYS.AFTER_CLICK);
          clickCount++;
          await delay(this.config.DELAYS.NAVIGATION);
        } else {
          break;
        }
      } catch {
        break;
      }
    }

    await this.logger.log(
      page,
      `${context} main 마지막 div 버튼 클릭 완료 - 총 ${clickCount}번 클릭됨`
    );
  }
}

import type { Page } from 'playwright';
import type { Config, NavigationService, Logger } from '@/types/index.js';
import { delay } from '@/utils/delay.js';

export class JeiService {
  constructor(
    private readonly config: Config,
    private readonly navigation: NavigationService,
    private readonly logger: Logger
  ) {}

  async findAndClickJeiCard(page: Page) {
    const cardSelectors = [
      { selector: this.config.SELECTORS.JEI_CARD_TEXT, method: '텍스트' },
      { selector: this.config.SELECTORS.JEI_CARD_CLASS, method: '클래스' },
      { selector: this.config.SELECTORS.JEI_CARD_STYLE, method: '스타일' },
    ];

    for (const { selector, method } of cardSelectors) {
      try {
        const cardButton = page.locator(selector);
        const cardExists = await cardButton.count();
        await this.logger.log(
          page,
          `${method}로 찾은 카드 개수: ${cardExists}`
        );

        if (cardExists > 0) {
          await cardButton.click();
          await delay(this.config.DELAYS.AFTER_CLICK);
          await this.logger.log(
            page,
            `재능스스로 카드 클릭 완료 (${method}로 찾음)`
          );
          return;
        }
      } catch {
        await this.logger.log(page, `${method}로 찾기 실패, 다음 방법 시도...`);
      }
    }

    await this.logger.log(page, '모든 방법으로 카드를 찾을 수 없습니다.');
    throw new Error('카드를 찾을 수 없음');
  }

  async clickJeiCard(page: Page) {
    await this.logger.log(page, '=== 국어 완료 후 추가 로직 시작 ===');

    await page.evaluate(() => {
      console.log('=== 브라우저 콘솔: 모든 버튼 확인 ===');
      const buttons = document.querySelectorAll('button');
      console.log(`총 버튼 개수: ${buttons.length}`);
      buttons.forEach((btn, index) => {
        console.log(`버튼 ${index + 1}:`, btn.className);
        console.log(`버튼 ${index + 1} 텍스트:`, btn.textContent?.trim());
      });
    });

    await this.logger.log(page, '재능스스로 카드 찾기 시도...');
    await this.findAndClickJeiCard(page);
  }

  async clickConfirmAndWait(page: Page) {
    await this.logger.log(page, '확인 버튼 찾기 시도...');
    await this.navigation.clickElementWithRetry(
      page,
      this.config.SELECTORS.CONFIRM_BUTTON,
      '확인 버튼'
    );

    await this.logger.log(page, '페이지 로딩 대기 시작...');
    const resetButtonAppeared = await this.navigation.waitForElement(
      page,
      this.config.SELECTORS.RESET_BUTTON
    );

    if (resetButtonAppeared) {
      await this.logger.log(page, '리셋 버튼이 나타남 - 페이지 로딩 완료');
    } else {
      await this.logger.log(
        page,
        '리셋 버튼 대기 시간 초과, 고정 대기로 진행...'
      );
      await delay(this.config.DELAYS.PAGE_LOAD);
    }

    await this.logger.log(page, '페이지 로딩 대기 완료');
  }

  async findAndClickResetButton(page: Page) {
    const resetSelectors = [
      'button.absolute.bottom-0.right-10.w-15.h-15.rounded-full.bg-\\[\\#DCE0E1\\].flex.justify-center.items-center.opacity-70.hover\\:cursor-pointer.block',
      'button[style*="box-shadow"]:has(svg)',
      this.config.SELECTORS.RESET_BUTTON,
    ];

    let resetExists = 0;

    for (let i = 0; i < resetSelectors.length; i++) {
      try {
        const resetButton = page.locator(resetSelectors[i] ?? '');
        resetExists = await resetButton.count();
        await this.logger.log(
          page,
          `리셋 버튼 존재 여부 (방법${i + 1}): ${resetExists > 0}`
        );

        if (resetExists > 0) {
          await resetButton.click();
          await delay(this.config.DELAYS.AFTER_CLICK);
          await this.logger.log(page, '리셋 버튼 클릭 완료 (count > 0)');
          return;
        }
      } catch {
        await this.logger.log(page, `방법${i + 1} 실패, 다음 방법 시도...`);
      }
    }

    await this.logger.log(page, 'count가 0이지만 리셋 버튼 클릭 시도...');
    await page.evaluate(() => {
      const resetButtons = document.querySelectorAll('button.rounded-full');
      console.log(
        '브라우저에서 찾은 rounded-full 버튼 개수:',
        resetButtons.length
      );
      if (resetButtons.length > 0) {
        (resetButtons[0] as HTMLButtonElement).click();
        console.log('브라우저에서 리셋 버튼 클릭 완료');
      }
    });
    await this.logger.log(page, '리셋 버튼 클릭 시도 완료');
  }

  async clickResetButton(page: Page) {
    await this.logger.log(page, '리셋 버튼 찾기 시도...');
    await this.navigation.waitForElement(
      page,
      this.config.SELECTORS.RESET_BUTTON
    );
    await this.findAndClickResetButton(page);
  }

  async clickRetryButton(page: Page) {
    await this.logger.log(page, '다시 하기 버튼 찾기 시도...');
    await this.navigation.waitForElement(
      page,
      this.config.SELECTORS.RETRY_BUTTON
    );
    await this.navigation.clickElementWithRetry(
      page,
      this.config.SELECTORS.RETRY_BUTTON,
      '다시 하기 버튼'
    );
  }
}

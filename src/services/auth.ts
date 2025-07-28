import type { Page } from 'playwright';
import type {
  Config,
  AuthService,
  NavigationService,
  Logger,
} from '@/types/index.js';

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly config: Config,
    private readonly navigation: NavigationService,
    private readonly logger: Logger
  ) {}

  async performLogin(page: Page): Promise<void> {
    await this.navigation.navigateToUrl(page, this.config.URLS.MAIN);

    const buttons = page.locator('[class*="cursor-pointer"]');
    await buttons.nth(0).click();

    await this.navigation.clickTextButton(page, '휴대폰 번호로 로그인');
    await this.navigation.clickTextButton(page, '확인');

    await page.getByPlaceholder('- 없이 입력').fill(this.config.PHONE_NUMBER);

    const nowTime = new Date().toISOString().replace(/[:.]/g, '-');
    await page.getByPlaceholder('이름 입력').fill(`테스트-${nowTime}`);

    await this.navigation.clickTextButton(page, '확인');

    const confirmButton = page.locator(
      '.flex.h-12.sm\\:h-16 button:has-text("확인")'
    );
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    await this.navigation.clickTextButton(page, '개인정보 수집 및 이용 동의');

    const successText = page.locator('text=인증성공');
    await successText.waitFor({ timeout: this.config.TIMEOUTS.AUTH_SUCCESS });
    await this.navigation.clickTextButton(page, '확인');
  }

  async performLogout(page: Page): Promise<void> {
    await this.logger.log(page, '로그아웃 시작...');

    await this.navigation.clickElementWithRetry(
      page,
      this.config.SELECTORS.LOGOUT_BUTTON,
      '로그아웃 버튼'
    );

    await this.navigation.clickElementWithRetry(
      page,
      this.config.SELECTORS.LOGOUT_CONFIRM_BUTTON,
      '로그아웃 확인 버튼'
    );

    await this.logger.log(page, '로그아웃 완료');
  }
}

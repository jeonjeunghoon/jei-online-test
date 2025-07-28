import fs from 'fs';
import { chromium, type Browser, type Page } from 'playwright';
import type {
  AutomationRunner,
  Config,
  AuthService,
  TestService,
  NavigationService,
  Logger,
  ScreenshotService,
} from '@/types/index.js';
import { JeiService } from '@/services/jei.js';

export class AutomationRunnerImpl implements AutomationRunner {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(
    private readonly config: Config,
    private readonly authService: AuthService,
    private readonly testService: TestService,
    private readonly navigationService: NavigationService,
    private readonly jeiService: JeiService,
    private readonly logger: Logger,
    private readonly screenshotService: ScreenshotService
  ) {}

  async run(): Promise<void> {
    let error: Error | null = null;

    try {
      await this.initializeBrowser();
      if (!this.page) throw new Error('페이지 초기화 실패');

      await this.authService.performLogin(this.page);
      await this.navigationService.navigateToUrl(
        this.page,
        this.config.URLS.PROFILE_ADD
      );
      await this.runAllTests();
      await this.runJeiRetryFlow();

      // eslint-disable-next-line no-console
      console.log('=== 전체 스크립트 완료 ===');
    } catch (err) {
      error = err as Error;
      this.logger.error('스크립트 실행 중 에러 발생:', error);

      if (this.page) {
        await this.screenshotService.saveErrorScreenshot(this.page, error);
      }
    } finally {
      await this.cleanup(error);
    }
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.VIEW_TEST_MODE ? false : true,
    });
    this.page = await this.browser.newPage();
  }

  private async runAllTests(): Promise<void> {
    if (!this.page) throw new Error('페이지가 초기화되지 않음');

    for (let i = 0; i < this.config.SUBJECTS.length; i++) {
      const subject = this.config.SUBJECTS[i];
      if (!subject) continue;

      const isLastSubject = i === this.config.SUBJECTS.length - 1;

      await this.testService.testSubject(this.page, subject, isLastSubject);

      if (!isLastSubject) {
        await this.navigationService.navigateToUrl(
          this.page,
          this.config.URLS.PROFILE_LIST
        );
        await this.navigationService.navigateToUrl(
          this.page,
          this.config.URLS.PROFILE_ADD
        );
      }
    }
  }

  private async runJeiRetryFlow(): Promise<void> {
    if (!this.page) throw new Error('페이지가 초기화되지 않음');

    await this.navigationService.navigateToUrl(
      this.page,
      this.config.URLS.PROFILE_LIST
    );
    await this.jeiService.clickJeiCard(this.page);
    await this.jeiService.clickConfirmAndWait(this.page);
    await this.jeiService.clickResetButton(this.page);
    await this.jeiService.clickRetryButton(this.page);
    await this.testService.retryTest(this.page);

    // 다시하기 테스트 완료 후 프로필 리스트로 돌아가서 로그아웃
    await this.navigationService.navigateToUrl(
      this.page,
      this.config.URLS.PROFILE_LIST
    );
    await this.authService.performLogout(this.page);
  }

  private async cleanup(error: Error | null): Promise<void> {
    const now = new Date().toISOString();
    const message = error
      ? `점검 실패: ${error.message} (${now})`
      : `점검 성공: ${now}`;

    fs.writeFileSync('/tmp/jei-log.txt', message);

    if (this.browser) {
      await this.browser.close();
    }
  }
}

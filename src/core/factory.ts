import { config } from '@/config/config.js';
import { LoggerService } from '@/utils/logger.js';
import { ScreenshotServiceImpl } from '@/utils/screenshot.js';
import { NavigationServiceImpl } from '@/services/navigation.js';
import { AuthServiceImpl } from '@/services/auth.js';
import { TestServiceImpl } from '@/services/test.js';
import { JeiService } from '@/services/jei.js';
import { AutomationRunnerImpl } from './automation-runner.js';
import type { AutomationRunner } from '@/types/index.js';

export class ServiceFactory {
  private static instance: ServiceFactory;

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  createAutomationRunner(): AutomationRunner {
    // 기본 유틸리티 서비스들
    const logger = new LoggerService();
    const screenshotService = new ScreenshotServiceImpl();

    // 네비게이션 서비스
    const navigationService = new NavigationServiceImpl(config, logger);

    // 인증 서비스
    const authService = new AuthServiceImpl(config, navigationService, logger);

    // 테스트 서비스
    const testService = new TestServiceImpl(config, navigationService, logger);

    // JEI 특화 서비스
    const jeiService = new JeiService(config, navigationService, logger);

    // 자동화 러너
    return new AutomationRunnerImpl(
      config,
      authService,
      testService,
      navigationService,
      jeiService,
      logger,
      screenshotService
    );
  }
}

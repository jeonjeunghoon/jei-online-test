import type { Page } from 'playwright';

export interface Config {
  VIEW_TEST_MODE: boolean;
  TIMEOUTS: {
    PAGE_LOAD: number;
    ELEMENT_WAIT: number;
    AUTH_SUCCESS: number;
    CLICK: number;
  };
  DELAYS: {
    TEST_STEP: number;
    CLICK_INTERVAL: number;
    NAVIGATION: number;
    PAGE_LOAD: number;
    AFTER_CLICK: number;
  };
  URLS: {
    MAIN: string;
    PROFILE_ADD: string;
    PROFILE_LIST: string;
  };
  SELECTORS: {
    NAVIGATION_BUTTONS: string;
    START_LINK: string;
    MAIN_NAVIGATION_BUTTON: string;
    CONFIRM_BUTTON: string;
    RESET_BUTTON: string;
    RETRY_BUTTON: string;
    JEI_CARD_TEXT: string;
    JEI_CARD_CLASS: string;
    JEI_CARD_STYLE: string;
    LOGOUT_BUTTON: string;
    LOGOUT_CONFIRM_BUTTON: string;
  };
  SUBJECTS: string[];
  PHONE_NUMBER: string;
}

export interface Logger {
  log(page: Page, message: string, isBrowserLog?: boolean): Promise<void>;
  error(message: string, error?: Error): void;
}

export interface ScreenshotService {
  saveErrorScreenshot(page: Page, error: Error): Promise<void>;
}

export interface NavigationService {
  waitForElement(
    page: Page,
    selector: string,
    timeout?: number
  ): Promise<boolean>;
  clickElementWithRetry(
    page: Page,
    selector: string,
    context?: string
  ): Promise<boolean>;
  clickTextButton(page: Page, text: string): Promise<void>;
  navigateToUrl(page: Page, url: string): Promise<void>;
}

export interface TestService {
  testSubject(
    page: Page,
    subject: string,
    continueUntilEnd?: boolean
  ): Promise<void>;
  submitTest(page: Page, continueUntilEnd?: boolean): Promise<void>;
  retryTest(page: Page): Promise<void>;
}

export interface AuthService {
  performLogin(page: Page): Promise<void>;
  performLogout(page: Page): Promise<void>;
}

export interface AutomationRunner {
  run(): Promise<void>;
}

export type Subject = '수학' | '한자' | '영어' | '국어';

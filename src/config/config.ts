import type { Config } from '@/types/index.js';

export const config: Config = {
  VIEW_TEST_MODE: true,
  TIMEOUTS: {
    PAGE_LOAD: 10000,
    ELEMENT_WAIT: 10000,
    AUTH_SUCCESS: 300000,
    CLICK: 1000,
  },
  DELAYS: {
    TEST_STEP: 1000,
    CLICK_INTERVAL: 500,
    NAVIGATION: 1000,
    PAGE_LOAD: 3000,
  },
  URLS: {
    MAIN: 'https://jindan.jei.com/',
    PROFILE_ADD: 'https://jindan.jei.com/profile-add',
    PROFILE_LIST: 'https://jindan.jei.com/profile-list',
  },
  SELECTORS: {
    NAVIGATION_BUTTONS: '.absolute.top-25.sm\\:top-35.translate-y-\\[-50\\%\\]',
    START_LINK: '#root > div:nth-of-type(2) a:has-text("시작하기")',
    MAIN_NAVIGATION_BUTTON:
      'main > div:last-child > button.z-10.max-xs\\:hidden.w-8.h-8.xs\\:w-10.xs\\:h-10.md\\:h-16.md\\:w-16.shrink-0.flex.justify-center',
    CONFIRM_BUTTON:
      'button.text-white.p-2.w-full.bg-primary-400.mx-auto.text-xl.md\\:text-2xl.font-nanumBold',
    RESET_BUTTON: 'button.rounded-full',
    RETRY_BUTTON:
      'button.w-full.text-xl.text-white.sm\\:text-2xl.bg-theme-primary-400.font-nanumBold',
    JEI_CARD_TEXT: 'button:has-text("재능스스로")',
    JEI_CARD_CLASS: 'button.w-[300px].h-[350px]',
    JEI_CARD_STYLE: 'button[style*="box-shadow"]',
    LOGOUT_BUTTON: 'button.absolute.w-9.right-8.max-xs\\:w-7',
    LOGOUT_CONFIRM_BUTTON:
      'button.w-full.text-xl.text-white.sm\\:text-2xl.bg-primary-400.font-nanumBold',
  },
  SUBJECTS: ['수학', '한자', '영어', '국어'],
  PHONE_NUMBER: '01063889000',
};

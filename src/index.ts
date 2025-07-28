// 경로 별칭 등록 (최상단에서 실행)
import '@/utils/path-resolver.js';
import { autoRegisterPaths } from '@/utils/path-resolver.js';
import { ServiceFactory } from '@/core/factory.js';

// 경로 별칭 자동 등록
autoRegisterPaths();

async function main(): Promise<void> {
  const factory = ServiceFactory.getInstance();
  const automationRunner = factory.createAutomationRunner();

  await automationRunner.run();
}

// 메인 함수 실행
main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('애플리케이션 실행 중 치명적 에러:', error);
  process.exit(1);
});

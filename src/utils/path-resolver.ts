import { register } from 'tsconfig-paths';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * tsconfig의 paths 설정을 로드하고 등록합니다.
 */
export function registerTsconfigPaths() {
  try {
    const tsconfigPath = resolve(process.cwd(), 'tsconfig.paths.json');
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));

    const baseUrl = tsconfig.compilerOptions?.baseUrl ?? '.';
    const paths = tsconfig.compilerOptions?.paths ?? {};

    const cleanup = register({
      baseUrl: resolve(process.cwd(), baseUrl),
      paths,
    });

    // 프로세스 종료 시 정리
    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    return cleanup;
  } catch (error) {
    console.warn('Failed to register tsconfig paths:', error);
    return undefined;
  }
}

/**
 * 개발환경에서 자동으로 경로 별칭을 등록합니다.
 */
export function autoRegisterPaths() {
  if (process.env['NODE_ENV'] !== 'production') {
    registerTsconfigPaths();
  }
}

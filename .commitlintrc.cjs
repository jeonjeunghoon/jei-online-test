module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 스타일 변경 (포매팅, 세미콜론 등)
        'refactor', // 코드 리팩토링
        'perf', // 성능 향상
        'test', // 테스트 추가/수정
        'chore', // 빌드 관련, 패키지 매니저 설정 등
        'ci', // CI/CD 관련 변경
        'build', // 빌드 시스템 관련 변경
        'revert', // 이전 커밋 되돌리기
      ],
    ],
    'subject-max-length': [2, 'always', 72],
    'subject-case': [2, 'always', 'sentence-case'],
  },
};

---
name: prek-quality-gate
description: npm 스크립트 기반의 정적 분석/타입체크/빌드 품질 게이트를 실행하는 절차.
---

## When to Use

- 코드 변경 후, 병합/커밋 전에 항상 수행
- **도구 사용 강제**: 분석 및 탐색 과정에서 `code-index`, `Context7`, `Sequential Thinking` MCP 사용 준수 확인

## Primary Gate

- **정적 분석/타입체크**: `npm run check`
- **프로덕션 빌드**: `npm run build`
- **로컬 프리뷰(선택)**: `npm run preview`

## Required Outcome

- `npm run check`와 `npm run build`가 모두 성공해야 함
- 빌드 산출물은 `build/` 디렉터리에 생성되어야 함(GitHub Pages 업로드 경로)

## References

- `package.json` scripts
- `.github/workflows/ci-workflow.yml`

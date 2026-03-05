---
name: dockerfile-optimization
description: Dockerfile을 도입/변경할 때 Node 기반 빌드 캐싱과 최소 이미지를 유지하는 체크리스트.
---

## When to Use

- 이 저장소에 Dockerfile을 추가하거나, 이미지 빌드 파이프라인을 수정할 때

## Rules

- 멀티 스테이지 빌드를 우선 사용한다(빌드/런타임 분리).
- 캐시 최적화를 위해 `package-lock.json`과 `package.json`을 먼저 복사하고 `npm ci`를 먼저 실행한다.
- 빌드 출력물은 정적 산출물(`build/`)만 남기고 불필요한 파일을 포함하지 않는다.
- Node 버전은 CI와 동일하게 18을 기준으로 한다.

## Validation

- 컨테이너에서 `npm run check`와 `npm run build`를 실행해 동일 결과를 확인한다.

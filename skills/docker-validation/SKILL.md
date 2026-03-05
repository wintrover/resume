---
name: docker-validation
description: 로컬 환경 문제(Node 버전/의존성/OS 차이)로 인해 검증이 불가능할 때, Node 컨테이너로 동일 절차를 재현하는 검증 가이드.
---

## When to Use

- **Node 버전 불일치**: 로컬 Node가 CI(Node 18)와 달라 재현이 어려울 때
- **클린 설치 필요**: `node_modules` 상태/캐시 영향 없이 재현해야 할 때
- **격리 검증**: CI와 동일한 방식(`npm ci` + 빌드)으로 최종 확인이 필요할 때

## Key Principles

- **Zero-Modification Policy**: 환경 차이를 이유로 소스/의존성을 임시로 변경하지 않는다.
- **CI Parity**: 가능한 한 CI와 동일하게 `npm ci`를 사용한다.

## Procedures

1. **컨테이너에서 클린 설치 + 검증 실행**:
   - PowerShell 예시
     - `docker run --rm -v ${PWD}:/app -w /app node:18-bullseye bash -lc "npm ci && npm run check && npm run build"`
2. **산출물 확인**: `build/` 디렉터리가 생성되는지 확인한다.

## Checklist

- [ ] 컨테이너에서 `npm run check`가 통과하는가?
- [ ] 컨테이너에서 `npm run build`가 통과하는가?
- [ ] 로컬/컨테이너 간에 경로(`base`) 관련 차이가 없는가?

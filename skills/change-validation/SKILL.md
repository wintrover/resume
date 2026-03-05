---
name: change-validation
description: 코드 변경 시 품질 게이트를 수행하고 변경 무결성을 검증하는 절차.
---

## When to Use

- 기능 추가/버그 수정/리팩터링 등 코드 변경이 있는 모든 작업

## Workflow

### 0) MCP 도구 사용 (필수)

- 모든 탐색 및 사고 과정에서 `AGENTS.md`에 정의된 MCP 도구(`code-index`, `Context7`, `Sequential Thinking`)를 강제로 사용한다.

### 1) 품질 게이트 (필수)

- `prek-quality-gate`를 수행하여 정적 분석/타입체크 및 빌드 검증을 완료한다.

### 2) 원자적 커밋 및 푸시 (필수)

- 변경 사항을 논리적 단위로 나누어 커밋하고 원격 저장소에 푸시한다.

## Completion Criteria

- 품질 게이트가 모두 통과
- 변경 내용이 논리적으로 커밋됨

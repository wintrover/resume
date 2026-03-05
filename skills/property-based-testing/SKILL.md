---
name: property-based-testing
description: TypeScript에서 속성 기반 테스트(PBT)를 도입할 때의 가이드. 순수 로직의 엣지 케이스를 자동 탐색한다.
---

## When to Use

- 입력 값의 범위가 넓거나 복잡한 로직을 검증할 때
- 경계값 검사(BVA) 및 동등 분할(EP)이 필요한 모든 경우
- 수동으로 작성하기 힘든 엣지 케이스를 자동으로 발견하고 싶을 때

## Tools

- **TypeScript/JavaScript**: [fast-check](https://fast-check.dev/)

## Guidelines

### TypeScript (fast-check)

- **핵심 구조**: `fc.assert(fc.property(...))`를 기본으로 사용하며, 테스트 러너(Jest, Vitest 등)와 결합한다.
- **데이터 생성**: `fc.record`, `fc.array`, `fc.integer` 등 빌트인 Arbitrary를 조합하여 복잡한 모델을 정의한다.
- **Shrinking**: `.map`을 사용할 때는 반드시 `unmapper`를 제공하여 실패 케이스의 효율적인 축소(Shrink)를 보장한다.
- **도입 원칙**: 이 저장소는 기본 테스트 러너/fast-check 의존성이 포함되어 있지 않으므로, 도입이 필요할 때만 최소 범위로 추가한다.

```typescript
import * as fc from 'fast-check';

test('두 숫자의 합은 순서에 상관없어야 한다 (교환법칙)', () => {
  fc.assert(
    fc.property(fc.integer(), fc.integer(), (a, b) => {
      return add(a, b) === add(b, a);
    })
  );
});

// 복잡한 레코드 생성 예시
const PersonArbitrary = fc.record({
  firstName: fc.string(),
  lastName: fc.string(),
  age: fc.nat({ max: 120 }),
  address: fc.record({
    street: fc.string(),
    city: fc.string()
  })
});
```

## Checklist

- [ ] EP-BVA를 수동으로 작성하는 대신 PBT 도구를 사용했는가?
- [ ] TypeScript에서 `.map` 사용 시 `unmapper`를 고려했는가?
- [ ] 테스트 실패 시 출력된 최소 재현 케이스(Shrinked result)를 확인했는가?

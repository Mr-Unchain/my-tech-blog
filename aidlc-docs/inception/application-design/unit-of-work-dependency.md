# Unit of Work Dependency: 執筆環境 / CMS 戦略

## Dependency Matrix

| Unit | Depends On | Dependency Type | Reason |
|---|---|---|---|
| Unit 1: Markdown / MDX Article Foundation | none | Foundation | Article type, schema, repository are prerequisites for all runtime work. |
| Unit 2: Public Article Query and Surface Integration | Unit 1 | Hard | Public pages need the Article model and repository boundary. |
| Unit 3: Preview and PR Publishing Workflow | Unit 1, Unit 2 | Medium | Preview depends on article source and page integration; documentation can begin earlier but final validation needs Unit 2. |
| Unit 4: microCMS Blog Migration Support | Unit 1 | Hard | Migration target schema and stable ID rules must exist first. |
| Unit 5: Security, Validation, Tests, and Documentation | Unit 1, Unit 2, Unit 3, Unit 4 | Hard | Cross-cutting verification depends on implemented behavior and docs. |

## Recommended Implementation Order

1. Unit 1: Markdown / MDX Article Foundation
2. Unit 2: Public Article Query and Surface Integration
3. Unit 4: microCMS Blog Migration Support
4. Unit 3: Preview and PR Publishing Workflow
5. Unit 5: Security, Validation, Tests, and Documentation

Unit 3 can start in parallel after Unit 1 if only authoring documentation is being drafted. Final preview and PR checklist should wait until Unit 2 behavior is known.

## Parallelization Notes

| Work | Parallelizable | Notes |
|---|---|---|
| Unit 1 schema and repository | No | Foundation work must be coherent before dependent units. |
| Unit 2 page integration | Partial | Individual pages can be migrated one by one after Public Article Service exists. |
| Unit 3 docs | Yes | Authoring docs can draft early, but preview details depend on Unit 2. |
| Unit 4 migration mapping | Partial | Field mapping can be drafted after Unit 1 schema; script/procedure validation needs Unit 1. |
| Unit 5 tests | Partial | Tests can be added per unit, final coverage requires all units. |

## Critical Paths

### Runtime Public Surface Path

Unit 1 -> Unit 2 -> Unit 5

This path controls whether the site can render published Markdown / MDX articles safely.

### Migration Path

Unit 1 -> Unit 4 -> Unit 5

This path controls whether existing microCMS blog data can be moved without losing IDs, dates, categories, and eyecatch references.

### Publishing Workflow Path

Unit 1 -> Unit 2 -> Unit 3 -> Unit 5

This path controls whether authors can preview and publish through PR review.

## Component-to-Unit Mapping

| Component | Unit |
|---|---|
| C1 Article Domain Model | Unit 1 |
| C2 Article Frontmatter Schema | Unit 1 |
| C3 Markdown Article Repository | Unit 1 |
| C4 Public Article Query Service | Unit 2 |
| C5 Preview Article Query Service | Unit 3 |
| C6 Legacy microCMS Content Repository | Unit 4 |
| C7 Public Surface Integration | Unit 2 |
| C8 microCMS Blog Migration Support | Unit 4 |
| C9 Publishing Workflow Documentation | Unit 3, Unit 5 |
| C10 Security and Validation Boundary | Unit 1, Unit 2, Unit 4, Unit 5 |

## Service-to-Unit Mapping

| Service | Unit |
|---|---|
| S1 Article Source Service | Unit 1 |
| S2 Public Article Service | Unit 2 |
| S3 Preview Service | Unit 3 |
| S4 Legacy CMS Service | Unit 4 |
| S5 Migration Service | Unit 4 |
| S6 Publishing Workflow Service | Unit 3, Unit 5 |

## Dependency Risks

| Risk | Affected Units | Mitigation |
|---|---|---|
| Article ID / slug rule changes after page integration | Unit 1, Unit 2, Unit 4 | Set ID / slug rule in Unit 1 Functional Design before Unit 2 implementation. |
| Draft filtering duplicated in pages | Unit 2, Unit 5 | Public Article Service must centralize published filtering. |
| Migration output does not match runtime schema | Unit 1, Unit 4 | Unit 4 output must pass Unit 1 validation. |
| Bookmark list remains coupled to microCMS blog API | Unit 2 | Replace article lookup through Public Article Service. |
| Preview exposes draft publicly | Unit 3, Unit 5 | Keep MVP preview local / PR preview oriented and verify no production draft route. |

## Construction Stage Implications

- Functional Design should start with Unit 1 because all downstream units depend on article shape and validation semantics.
- NFR Requirements / NFR Design should explicitly revisit SECURITY-05, SECURITY-11, SECURITY-13, and SECURITY-15 for Units 1, 2, and 4.
- Infrastructure Design remains skipped for MVP unless a later unit introduces new hosting, storage, or authentication infrastructure.


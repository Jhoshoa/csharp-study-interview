# Architecture & Domain-Driven Design

## Clean Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │  Controllers, Views, API
├─────────────────────────────────────────┤
│           Application Layer             │  Use Cases, DTOs, Services
├─────────────────────────────────────────┤
│             Domain Layer                │  Entities, Value Objects, Domain Services
├─────────────────────────────────────────┤
│          Infrastructure Layer           │  Database, External Services, Repositories
└─────────────────────────────────────────┘

Dependencies point INWARD (Infrastructure → Domain)
```

## Key Concepts

### Clean Architecture
- Independent of frameworks
- Testable business logic
- Independent of UI
- Independent of database

### Domain-Driven Design (DDD)

| Concept | Description |
|---------|-------------|
| Entity | Has identity (Id), mutable |
| Value Object | No identity, immutable, compared by value |
| Aggregate | Cluster of entities with a root |
| Repository | Abstracts data persistence |
| Domain Service | Business logic that doesn't fit in entities |
| Domain Event | Something that happened in the domain |

### CQRS (Command Query Responsibility Segregation)
- **Commands**: Change state (Create, Update, Delete)
- **Queries**: Read state (no side effects)
- Separate read/write models for complex domains

### Event Sourcing
- Store events instead of current state
- Rebuild state by replaying events
- Complete audit trail

## Microservices Patterns

| Pattern | Purpose |
|---------|---------|
| API Gateway | Single entry point |
| Service Discovery | Find service instances |
| Circuit Breaker | Handle failures gracefully |
| Saga | Distributed transactions |
| Event-Driven | Async communication |

## Files to Create

- `01-CleanArchitecture.md`
- `02-DDD-Basics.md`
- `03-CQRS.md`
- `04-EventSourcing.md`
- `05-Microservices.md`

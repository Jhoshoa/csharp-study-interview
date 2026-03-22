# LINQ & Collections - Senior Level

## Study Order

These topics are interconnected. Study in order:

| # | File | Key Concepts |
|---|------|--------------|
| 1 | `01-IEnumerableVsIQueryable.md` | The critical difference, query translation |
| 2 | `02-DeferredVsImmediateExecution.md` | Lazy evaluation, multiple enumeration |
| 3 | `03-LINQOperators.md` | All operators by category, query vs method syntax |
| 4 | `04-Collections.md` | List, Dictionary, HashSet, choosing the right type |
| 5 | `05-IteratorsYield.md` | yield return, state machines, async enumeration |
| 6 | `06-LINQPerformance.md` | Optimization, allocation, benchmarking |

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│            IEnumerable<T> vs IQueryable<T>                   │
├─────────────────────────────────────────────────────────────┤
│ IEnumerable<T>:                                             │
│   - In-memory filtering (LINQ-to-Objects)                   │
│   - Uses delegates: Func<T, bool>                           │
│   - Pulls ALL data, then filters                            │
│                                                             │
│ IQueryable<T>:                                              │
│   - Provider-side filtering (LINQ-to-SQL/EF)                │
│   - Uses expressions: Expression<Func<T, bool>>             │
│   - Filters at source, pulls only results                   │
│                                                             │
│ CRITICAL: Return IQueryable from repositories!              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               DEFERRED vs IMMEDIATE                          │
├─────────────────────────────────────────────────────────────┤
│ Deferred (Lazy):                                            │
│   Where, Select, OrderBy, GroupBy, Join                     │
│   → Query defined, not executed                             │
│   → Executes on iteration (foreach, ToList)                 │
│                                                             │
│ Immediate:                                                  │
│   ToList, ToArray, Count, First, Any, Sum                   │
│   → Executes immediately                                    │
│   → Returns concrete result                                 │
│                                                             │
│ GOTCHA: Multiple enumeration = multiple execution!          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                COLLECTION SELECTION                          │
├─────────────────────────────────────────────────────────────┤
│ Need             | Use           | Why                      │
│ ─────────────────|───────────────|─────────────────────────│
│ Index access     | List<T>       | O(1) access              │
│ Key lookup       | Dictionary    | O(1) by key              │
│ Unique values    | HashSet<T>    | O(1) Contains            │
│ Sorted unique    | SortedSet<T>  | O(log n), sorted         │
│ FIFO queue       | Queue<T>      | Enqueue/Dequeue          │
│ LIFO stack       | Stack<T>      | Push/Pop                 │
│ Insert/Remove    | LinkedList<T> | O(1) at known position   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   LINQ OPERATORS                             │
├─────────────────────────────────────────────────────────────┤
│ Filtering:    Where, OfType                                 │
│ Projection:   Select, SelectMany (flattening)               │
│ Ordering:     OrderBy, ThenBy, Reverse                      │
│ Grouping:     GroupBy, ToLookup                             │
│ Joining:      Join, GroupJoin, Zip, Concat                  │
│ Set:          Distinct, Union, Intersect, Except            │
│ Aggregate:    Count, Sum, Average, Min, Max, Aggregate      │
│ Element:      First, Single, ElementAt, DefaultIfEmpty      │
│ Quantifier:   Any, All, Contains                            │
│ Partition:    Take, Skip, TakeWhile, Chunk                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   ITERATOR (yield)                           │
├─────────────────────────────────────────────────────────────┤
│ yield return x;  - Return next value                        │
│ yield break;     - Stop iteration                           │
│                                                             │
│ Benefits:                                                   │
│   - Lazy evaluation (compute on demand)                     │
│   - Infinite sequences possible                             │
│   - Minimal memory usage                                    │
│                                                             │
│ Gotchas:                                                    │
│   - Exceptions thrown on enumeration, not method call       │
│   - Cannot yield in catch block                             │
│   - finally runs on Dispose()                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               PERFORMANCE TIPS                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Filter (Where) BEFORE Transform (Select)                 │
│ 2. Take early if only need subset                           │
│ 3. Use HashSet for Contains, Dictionary for key lookup      │
│ 4. Materialize once: var list = query.ToList()             │
│ 5. AsNoTracking() for read-only EF queries                 │
│ 6. static lambda to prevent closure allocation              │
│ 7. Consider loop/Span<T> for hot paths                      │
└─────────────────────────────────────────────────────────────┘
```

## Common Patterns

### Safe Repository Pattern
```csharp
// Return IQueryable for composition
public IQueryable<User> GetUsers() => _context.Users;

// Consumers add their filters (translated to SQL)
var adults = repo.GetUsers()
    .Where(u => u.Age >= 18)
    .OrderBy(u => u.Name)
    .ToListAsync();
```

### Avoid Multiple Enumeration
```csharp
// BAD
IEnumerable<User> users = GetUsers();
var count = users.Count();   // Enumeration 1
var first = users.First();   // Enumeration 2

// GOOD
var users = GetUsers().ToList();
var count = users.Count;     // O(1)
var first = users[0];        // O(1)
```

### Fast Contains Check
```csharp
// BAD: O(n) per check
var ids = validIds.ToList();
items.Where(x => ids.Contains(x.Id));  // O(n*m)

// GOOD: O(1) per check
var ids = validIds.ToHashSet();
items.Where(x => ids.Contains(x.Id));  // O(n)
```

## Key Interview Topics

1. **"What's the difference between IEnumerable and IQueryable?"**
   → See: `01-IEnumerableVsIQueryable.md`

2. **"Explain deferred execution in LINQ"**
   → See: `02-DeferredVsImmediateExecution.md`

3. **"What's the difference between Select and SelectMany?"**
   → See: `03-LINQOperators.md` - Projection section

4. **"When would you use HashSet vs List?"**
   → See: `04-Collections.md` - Decision tree

5. **"How does yield return work?"**
   → See: `05-IteratorsYield.md` - State machine section

6. **"How do you optimize a slow LINQ query?"**
   → See: `06-LINQPerformance.md` - Full chapter

## Practice Exercises

1. **IEnumerable vs IQueryable**: Write a repository that returns IQueryable, then show how filtering affects generated SQL

2. **Deferred Execution**: Create a sequence with side effects, demonstrate when they execute

3. **Operators**: Implement custom `MyWhere` and `MySelect` using yield

4. **Collections**: Benchmark Contains() on List vs HashSet with 1M items

5. **Iterators**: Implement an infinite Fibonacci sequence using yield

6. **Performance**: Profile a LINQ query and optimize it step by step

## Real-World Applications

| Concept | Used By |
|---------|---------|
| IQueryable | Entity Framework, MongoDB driver, OData |
| Deferred Execution | Data streaming, lazy loading |
| SelectMany | Flattening API responses, tree traversal |
| GroupBy/ToLookup | Reporting, aggregations |
| Iterators | Custom data sources, generators |
| Parallel LINQ | CPU-intensive batch processing |

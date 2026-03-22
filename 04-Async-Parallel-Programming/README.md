# Async & Parallel Programming - Senior Level

## Study Order

These topics build on each other. Study in this order:

| # | File | Key Concepts |
|---|------|--------------|
| 1 | `01-AsyncAwaitFundamentals.md` | State machines, async/await, Task types |
| 2 | `02-TaskDeepDive.md` | Task creation, combinators, ValueTask |
| 3 | `03-SynchronizationContext.md` | Context capture, ConfigureAwait |
| 4 | `04-DeadlocksAndPitfalls.md` | Classic deadlock, async void, anti-patterns |
| 5 | `05-Cancellation.md` | CancellationToken, timeouts, linked tokens |
| 6 | `06-ParallelProgramming.md` | Parallel.For, PLINQ, TPL |
| 7 | `07-ThreadSafety.md` | Locks, Interlocked, concurrent collections |

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                  ASYNC VS PARALLEL                           │
├─────────────────────────────────────────────────────────────┤
│ I/O-Bound (Network, Disk, DB):                              │
│   → Use async/await                                         │
│   → Thread released during wait                             │
│   → await httpClient.GetStringAsync()                       │
│                                                             │
│ CPU-Bound (Calculations, Processing):                       │
│   → Use Parallel/PLINQ                                      │
│   → Multiple cores utilized                                 │
│   → Parallel.ForEach(items, Process)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               ASYNC/AWAIT KEY POINTS                         │
├─────────────────────────────────────────────────────────────┤
│ • async does NOT create threads                             │
│ • await releases thread, resumes when ready                 │
│ • Compiler generates state machine                          │
│ • async void only for event handlers                        │
│ • ConfigureAwait(false) in library code                     │
│ • Never block on async (.Result, .Wait())                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   TASK RETURN TYPES                          │
├─────────────────────────────────────────────────────────────┤
│ Task<T>    - Returns value, standard choice                 │
│ Task       - No return value, like awaitable void           │
│ ValueTask<T> - Struct, no alloc for sync paths              │
│ void       - ONLY for event handlers (dangerous!)           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                THE CLASSIC DEADLOCK                          │
├─────────────────────────────────────────────────────────────┤
│ Problem:                                                    │
│   var result = GetDataAsync().Result;  // In UI/ASP.NET     │
│                                                             │
│ Why it deadlocks:                                           │
│   1. .Result blocks UI thread                               │
│   2. await captures UI context                              │
│   3. Continuation needs UI thread                           │
│   4. UI thread is blocked → DEADLOCK                        │
│                                                             │
│ Solutions:                                                  │
│   • Async all the way: await GetDataAsync()                 │
│   • ConfigureAwait(false) in libraries                      │
│   • Task.Run to escape context (last resort)                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               CANCELLATION PATTERN                           │
├─────────────────────────────────────────────────────────────┤
│ using var cts = new CancellationTokenSource();              │
│                                                             │
│ // With timeout                                             │
│ cts.CancelAfter(TimeSpan.FromSeconds(30));                  │
│                                                             │
│ try {                                                       │
│     await DoWorkAsync(cts.Token);                           │
│ } catch (OperationCanceledException) {                      │
│     // Handle cancellation                                  │
│ }                                                           │
│                                                             │
│ // In your method:                                          │
│ public async Task DoWorkAsync(CancellationToken ct = default)│
│ {                                                           │
│     ct.ThrowIfCancellationRequested();                      │
│     await SomeApiAsync(ct);  // Pass token down             │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              PARALLEL EXECUTION                              │
├─────────────────────────────────────────────────────────────┤
│ // CPU-bound with Parallel                                  │
│ Parallel.ForEach(items, item => CpuWork(item));             │
│                                                             │
│ // I/O-bound with controlled concurrency (.NET 6+)          │
│ await Parallel.ForEachAsync(items,                          │
│     new ParallelOptions { MaxDegreeOfParallelism = 10 },    │
│     async (item, ct) => await IoWorkAsync(item, ct));       │
│                                                             │
│ // Multiple independent async operations                    │
│ var results = await Task.WhenAll(                           │
│     GetUser1Async(),                                        │
│     GetUser2Async(),                                        │
│     GetUser3Async()                                         │
│ );                                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              THREAD SAFETY TOOLS                             │
├─────────────────────────────────────────────────────────────┤
│ Simple Counter:     Interlocked.Increment(ref _count)       │
│ Critical Section:   lock (_lockObj) { ... }                 │
│ Async Lock:         SemaphoreSlim(1, 1)                     │
│ Many Reads/Few Writes: ReaderWriterLockSlim                 │
│ Concurrent Dict:    ConcurrentDictionary<K, V>              │
│ Producer-Consumer:  Channel<T> or BlockingCollection<T>     │
│ Throttling:         SemaphoreSlim(maxConcurrent)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                COMMON ANTI-PATTERNS                          │
├─────────────────────────────────────────────────────────────┤
│ ✗ task.Result                    → Use await                │
│ ✗ task.Wait()                    → Use await                │
│ ✗ async void                     → Use async Task           │
│ ✗ Task.Run in ASP.NET            → Already on thread pool   │
│ ✗ Forgetting to await            → Fire and forget danger   │
│ ✗ Not passing CancellationToken  → Can't cancel operations  │
│ ✗ lock on 'this' or Type         → Use private lock object  │
│ ✗ Shared state without sync      → Race conditions          │
└─────────────────────────────────────────────────────────────┘
```

## Decision Tree

### When to Use What?

```
Is the operation I/O-bound?
├── Yes: Use async/await
│   └── Need to run multiple? → Task.WhenAll
└── No (CPU-bound): Use Parallel
    ├── Simple loop? → Parallel.For/ForEach
    ├── LINQ query? → AsParallel()
    └── Mixed I/O + CPU? → Combine both
```

### Choosing Synchronization Primitives

```
What are you protecting?
├── Single variable (int, long)?
│   └── Use Interlocked
├── Code block with await?
│   └── Use SemaphoreSlim(1,1)
├── Read-heavy, few writes?
│   └── Use ReaderWriterLockSlim
├── Collection operations?
│   └── Use Concurrent collections
└── General mutual exclusion?
    └── Use lock
```

## Key Interview Topics

1. **"How does async/await work internally?"**
   → See: `01-AsyncAwaitFundamentals.md` - State machine section

2. **"Explain the classic async deadlock"**
   → See: `04-DeadlocksAndPitfalls.md` - Classic deadlock section

3. **"When should you use ConfigureAwait(false)?"**
   → See: `03-SynchronizationContext.md` - ConfigureAwait section

4. **"What's the difference between Task.Run and async/await?"**
   → See: `02-TaskDeepDive.md` - Task.Run vs async/await section

5. **"How do you handle cancellation in async code?"**
   → See: `05-Cancellation.md` - Full chapter

6. **"When would you use Parallel vs async?"**
   → See: `06-ParallelProgramming.md` - Async vs Parallel section

7. **"How do you make code thread-safe?"**
   → See: `07-ThreadSafety.md` - Full chapter

## Practice Exercises

1. **Deadlock Demo**: Create a deadlock with .Result in a WinForms/WPF app, then fix it

2. **Timeout Pattern**: Implement a method that wraps any async call with a timeout

3. **Throttled Downloads**: Download 100 URLs with max 10 concurrent requests

4. **Producer-Consumer**: Implement a producer-consumer using Channel<T>

5. **Thread-Safe Counter**: Implement a counter that works correctly under parallel load

6. **Cancellation Chain**: Create nested async methods that properly pass CancellationToken

## Real-World Scenarios

| Scenario | Pattern |
|----------|---------|
| HTTP requests | async/await + HttpClient |
| Database queries | async/await + EF Core |
| Image processing | Parallel.ForEach |
| API rate limiting | SemaphoreSlim |
| Cache with expiration | ConcurrentDictionary |
| Background processing | BackgroundService + Channel |
| Batch processing | Parallel.ForEachAsync |
| Real-time updates | IAsyncEnumerable |

## Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using .Result | Deadlock in UI/ASP.NET | Use await |
| async void | Lost exceptions | Use async Task |
| Not awaiting tasks | Lost errors | Await or handle explicitly |
| Lock in async | Possible deadlock | Use SemaphoreSlim |
| New thread per request | Thread exhaustion | Use async or thread pool |
| Ignoring ConfigureAwait | Perf issues in libraries | Use ConfigureAwait(false) |

## ASP.NET Core Specifics

- **No SynchronizationContext** - ConfigureAwait(false) not needed
- **RequestAborted token** - Always honor for long operations
- **Avoid Task.Run** - Already on thread pool
- **IHostApplicationLifetime** - For graceful shutdown coordination
- **Scoped services** - Be careful with async and DI scopes

# Async/Await & Concurrency Interview Questions

## Async Fundamentals

**Q: How does async/await work under the hood?**

A:
- `async` method is transformed into a state machine by the compiler
- `await` yields control to the caller, captures SynchronizationContext
- No new thread is created for I/O operations

```csharp
// What you write
public async Task<string> GetDataAsync()
{
    var data = await httpClient.GetStringAsync(url);
    return data.ToUpper();
}

// What compiler generates (simplified)
public Task<string> GetDataAsync()
{
    var stateMachine = new GetDataAsyncStateMachine();
    stateMachine.builder = AsyncTaskMethodBuilder<string>.Create();
    stateMachine.state = -1;
    stateMachine.builder.Start(ref stateMachine);
    return stateMachine.builder.Task;
}
```

---

## Task vs Thread

**Q: What is the difference between Task and Thread?**

A:
- **Thread**: OS-level, expensive (1MB stack), explicit management
- **Task**: Abstraction over thread pool, lightweight, composable

```csharp
// Thread - manual, low-level
var thread = new Thread(() =>
{
    Console.WriteLine("Running on thread");
});
thread.Start();
thread.Join();

// Task - high-level, uses thread pool
var task = Task.Run(() =>
{
    Console.WriteLine("Running on thread pool");
});
await task;

// I/O Task - no thread blocked
var data = await File.ReadAllTextAsync("file.txt");
// Thread returns to pool during I/O
```

---

## Common Pitfalls

**Q: What are common async/await mistakes?**

A:

### 1. Async Void
```csharp
// BAD - Can't await, exceptions lost
public async void HandleClick()
{
    await DoWorkAsync(); // If this throws, app crashes
}

// GOOD - Use Task for async methods
public async Task HandleClickAsync()
{
    await DoWorkAsync();
}
```

### 2. Blocking on Async Code
```csharp
// BAD - Deadlock in ASP.NET/WinForms
public string GetData()
{
    return GetDataAsync().Result; // Deadlock!
}

// GOOD - Async all the way
public async Task<string> GetDataAsync()
{
    return await httpClient.GetStringAsync(url);
}
```

### 3. Missing ConfigureAwait in Libraries
```csharp
// Library code should use ConfigureAwait(false)
public async Task<T> LibraryMethodAsync()
{
    var data = await httpClient.GetAsync(url).ConfigureAwait(false);
    return await ProcessAsync(data).ConfigureAwait(false);
}
```

### 4. Unnecessary async/await
```csharp
// BAD - Unnecessary state machine
public async Task<int> GetCountAsync()
{
    return await _repository.CountAsync();
}

// GOOD - Return task directly
public Task<int> GetCountAsync()
{
    return _repository.CountAsync();
}

// EXCEPTION - Keep async when using try/catch/using
public async Task<int> GetCountSafeAsync()
{
    try
    {
        return await _repository.CountAsync();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex);
        return 0;
    }
}
```

---

## Parallel Processing

**Q: When to use Parallel.ForEach vs Task.WhenAll?**

A:
```csharp
// Parallel.ForEach - CPU-bound work
var items = Enumerable.Range(1, 1000).ToList();
Parallel.ForEach(items, new ParallelOptions { MaxDegreeOfParallelism = 4 },
    item =>
    {
        ProcessItem(item); // CPU-intensive
    });

// Task.WhenAll - I/O-bound work
var tasks = urls.Select(url => httpClient.GetStringAsync(url));
var results = await Task.WhenAll(tasks);

// With throttling for many I/O operations
var semaphore = new SemaphoreSlim(10); // Max 10 concurrent
var tasks = urls.Select(async url =>
{
    await semaphore.WaitAsync();
    try
    {
        return await httpClient.GetStringAsync(url);
    }
    finally
    {
        semaphore.Release();
    }
});
var results = await Task.WhenAll(tasks);
```

---

## CancellationToken

**Q: How do you implement cancellation properly?**

A:
```csharp
public async Task<List<Item>> GetItemsAsync(CancellationToken cancellationToken = default)
{
    var items = new List<Item>();

    // Check at beginning
    cancellationToken.ThrowIfCancellationRequested();

    // Pass to async methods
    var data = await _httpClient.GetAsync(url, cancellationToken);

    // Check in loops
    foreach (var item in data)
    {
        cancellationToken.ThrowIfCancellationRequested();
        items.Add(await ProcessAsync(item, cancellationToken));
    }

    return items;
}

// Controller usage
[HttpGet]
public async Task<IActionResult> GetItems(CancellationToken cancellationToken)
{
    var items = await _service.GetItemsAsync(cancellationToken);
    return Ok(items);
}

// Manual cancellation
var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(30)); // Timeout

try
{
    await LongRunningOperationAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Operation was cancelled");
}
```

---

## Thread Safety

**Q: How do you handle thread safety in C#?**

A:
```csharp
// 1. lock statement
private readonly object _lock = new object();
private int _count;

public void Increment()
{
    lock (_lock)
    {
        _count++;
    }
}

// 2. Interlocked - for simple atomic operations
private int _counter;

public void IncrementAtomic()
{
    Interlocked.Increment(ref _counter);
}

// 3. Concurrent collections
private readonly ConcurrentDictionary<string, int> _cache = new();

public void AddOrUpdate(string key, int value)
{
    _cache.AddOrUpdate(key, value, (k, old) => value);
}

// 4. SemaphoreSlim - async-friendly
private readonly SemaphoreSlim _semaphore = new(1, 1);

public async Task ThreadSafeOperationAsync()
{
    await _semaphore.WaitAsync();
    try
    {
        await DoWorkAsync();
    }
    finally
    {
        _semaphore.Release();
    }
}

// 5. ReaderWriterLockSlim - many readers, few writers
private readonly ReaderWriterLockSlim _rwLock = new();

public string Read()
{
    _rwLock.EnterReadLock();
    try { return _data; }
    finally { _rwLock.ExitReadLock(); }
}

public void Write(string value)
{
    _rwLock.EnterWriteLock();
    try { _data = value; }
    finally { _rwLock.ExitWriteLock(); }
}
```

---

## Deadlocks

**Q: What causes deadlocks and how to prevent them?**

A:
```csharp
// Deadlock example
public string GetData()
{
    // ASP.NET/WinForms captures SynchronizationContext
    // .Result blocks the thread
    // Continuation waits for same thread = DEADLOCK
    return GetDataAsync().Result;
}

// Prevention strategies:

// 1. Async all the way
public async Task<string> GetDataAsync()
{
    return await httpClient.GetStringAsync(url);
}

// 2. ConfigureAwait(false) in libraries
public async Task<string> LibraryGetDataAsync()
{
    return await httpClient.GetStringAsync(url).ConfigureAwait(false);
}

// 3. Use GetAwaiter().GetResult() if you must block (slightly better error handling)
public string GetDataBlocking()
{
    return GetDataAsync().GetAwaiter().GetResult();
}

// 4. Task.Run to escape sync context
public string GetDataSafe()
{
    return Task.Run(() => GetDataAsync()).GetAwaiter().GetResult();
}
```

---

## ValueTask

**Q: When should you use ValueTask instead of Task?**

A:
```csharp
// ValueTask - use when result is often available synchronously
// Avoids Task allocation in sync path

private readonly ConcurrentDictionary<int, User> _cache = new();

public ValueTask<User> GetUserAsync(int id)
{
    // Sync path - no allocation
    if (_cache.TryGetValue(id, out var user))
        return ValueTask.FromResult(user);

    // Async path - allocates
    return new ValueTask<User>(LoadUserAsync(id));
}

private async Task<User> LoadUserAsync(int id)
{
    var user = await _repository.GetByIdAsync(id);
    _cache[id] = user;
    return user;
}

// Rules for ValueTask:
// 1. Don't await more than once
// 2. Don't use .Result before completion
// 3. Don't use when you need to await multiple times
```

---

## Channels

**Q: What are Channels and when to use them?**

A: Channels are producer-consumer data structures for async scenarios.

```csharp
// Bounded channel - backpressure
var channel = Channel.CreateBounded<WorkItem>(100);

// Producer
async Task ProduceAsync(ChannelWriter<WorkItem> writer)
{
    foreach (var item in GetItems())
    {
        await writer.WriteAsync(item);
    }
    writer.Complete();
}

// Consumer
async Task ConsumeAsync(ChannelReader<WorkItem> reader)
{
    await foreach (var item in reader.ReadAllAsync())
    {
        await ProcessAsync(item);
    }
}

// Usage
var producer = ProduceAsync(channel.Writer);
var consumer = ConsumeAsync(channel.Reader);
await Task.WhenAll(producer, consumer);
```

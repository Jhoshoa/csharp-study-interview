# C# Interview Questions - Senior Level

## Value Types vs Reference Types

**Q: What is the difference between value types and reference types?**

A:
- **Value types** (struct, int, bool, enum) are stored on the stack and contain the actual data
- **Reference types** (class, interface, delegate, string, array) are stored on the heap with a reference on the stack
- Value types are copied by value, reference types are copied by reference

```csharp
// Value type - independent copies
int a = 5;
int b = a;
b = 10; // a is still 5

// Reference type - same object
List<int> list1 = new List<int> { 1, 2, 3 };
List<int> list2 = list1;
list2.Add(4); // list1 also has 4 elements
```

---

## Boxing and Unboxing

**Q: What is boxing and unboxing? What are the performance implications?**

A:
- **Boxing**: Converting a value type to object (reference type)
- **Unboxing**: Converting object back to value type
- Performance impact: Memory allocation on heap, copying data, GC pressure

```csharp
int num = 42;
object boxed = num;      // Boxing - allocates on heap
int unboxed = (int)boxed; // Unboxing - copies back to stack
```

---

## String Immutability

**Q: Why are strings immutable in C#? How do you handle many string operations?**

A:
- Strings are immutable for thread safety, security, and caching (string interning)
- Each modification creates a new string object
- Use `StringBuilder` for many concatenations

```csharp
// Bad - creates many string objects
string result = "";
for (int i = 0; i < 1000; i++)
    result += i.ToString(); // O(n^2) complexity

// Good - single buffer
var sb = new StringBuilder();
for (int i = 0; i < 1000; i++)
    sb.Append(i);
string result = sb.ToString();
```

---

## Abstract Class vs Interface

**Q: When would you use an abstract class vs an interface?**

A:
- **Abstract class**: Shared implementation, single inheritance, related classes
- **Interface**: Contract only, multiple implementation, unrelated classes

```csharp
// Abstract class - shared behavior
public abstract class Animal
{
    public string Name { get; set; }
    public abstract void MakeSound();
    public void Sleep() => Console.WriteLine("Sleeping...");
}

// Interface - capability contract
public interface ISerializable
{
    byte[] Serialize();
    void Deserialize(byte[] data);
}
```

---

## Generics

**Q: What are the benefits of generics? What are constraints?**

A:
- Type safety at compile time
- Code reusability without boxing/unboxing
- Performance improvement

```csharp
public class Repository<T> where T : class, IEntity, new()
{
    public T Create()
    {
        return new T();
    }
}

// Constraints: where T : class      - reference type
//              where T : struct     - value type
//              where T : new()      - parameterless constructor
//              where T : BaseClass  - inherits from class
//              where T : IInterface - implements interface
```

---

## Delegates and Events

**Q: What is the difference between delegates and events?**

A:
- **Delegate**: Type-safe function pointer
- **Event**: Encapsulated delegate with restricted access (only owner can invoke)

```csharp
public delegate void NotifyHandler(string message);

public class Publisher
{
    public event NotifyHandler OnNotify;

    public void Notify(string msg)
    {
        OnNotify?.Invoke(msg);  // Only publisher can invoke
    }
}

// Subscriber can only += or -=, cannot invoke
publisher.OnNotify += msg => Console.WriteLine(msg);
```

---

## IEnumerable vs IQueryable

**Q: What is the difference and when to use each?**

A:
- **IEnumerable**: In-memory collection, LINQ-to-Objects, executes locally
- **IQueryable**: Deferred execution, translates to query (SQL), executes on server

```csharp
// IEnumerable - all data loaded to memory, then filtered
IEnumerable<User> users = dbContext.Users.ToList();
var filtered = users.Where(u => u.Age > 18); // Filtered in memory

// IQueryable - filter translated to SQL WHERE clause
IQueryable<User> users = dbContext.Users;
var filtered = users.Where(u => u.Age > 18); // SQL: WHERE Age > 18
```

---

## Async/Await

**Q: How does async/await work? What are common pitfalls?**

A:
- `async` marks method as asynchronous
- `await` yields control until task completes
- Does NOT create new threads (uses thread pool)

```csharp
public async Task<string> GetDataAsync()
{
    // Thread returns to pool during I/O
    var response = await httpClient.GetAsync(url);
    return await response.Content.ReadAsStringAsync();
}

// Common pitfalls:
// 1. async void (can't catch exceptions)
// 2. .Result or .Wait() causing deadlocks
// 3. Not using ConfigureAwait(false) in libraries
```

---

## Garbage Collection

**Q: How does garbage collection work in .NET?**

A:
- Automatic memory management
- Generational: Gen 0 (short-lived), Gen 1, Gen 2 (long-lived)
- Large Object Heap (LOH) for objects > 85KB
- Triggers: Memory pressure, Gen 0 threshold, explicit GC.Collect()

```csharp
// Implement IDisposable for unmanaged resources
public class FileHandler : IDisposable
{
    private FileStream _stream;
    private bool _disposed;

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
                _stream?.Dispose();
            _disposed = true;
        }
    }
}
```

---

## Expression-bodied Members

**Q: What are expression-bodied members and when to use them?**

A:
```csharp
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    // Expression-bodied property
    public string FullName => $"{FirstName} {LastName}";

    // Expression-bodied method
    public override string ToString() => FullName;

    // Expression-bodied constructor
    public Person(string first, string last) => (FirstName, LastName) = (first, last);
}
```

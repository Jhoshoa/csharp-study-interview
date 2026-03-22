# C# Advanced Concepts - Senior Level

## Study Order

These topics build on each other. Study in order:

| # | File | Key Concepts |
|---|------|--------------|
| 1 | `01-Generics.md` | Type parameters, constraints, variance (covariance/contravariance) |
| 2 | `02-Delegates.md` | Function pointers, Func/Action/Predicate, multicast |
| 3 | `03-Events.md` | Publisher-subscriber, memory leaks, thread safety |
| 4 | `04-LambdasClosures.md` | Lambda syntax, closures, captured variables, loop trap |
| 5 | `05-Reflection.md` | Type inspection, dynamic invocation, performance |
| 6 | `06-Attributes.md` | Metadata, custom attributes, reading via reflection |
| 7 | `07-ExpressionTrees.md` | Code as data, LINQ providers, dynamic queries |

## Concept Dependencies

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│  Generics   │────▶│  Delegates  │────▶│     Events       │
└─────────────┘     └─────────────┘     └──────────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌──────────────────┐
                    │   Lambdas   │────▶│ Expression Trees │
                    │  & Closures │     │                  │
                    └─────────────┘     └──────────────────┘
                           │
                           ▼
┌─────────────┐     ┌─────────────┐
│ Attributes  │◀────│ Reflection  │
└─────────────┘     └─────────────┘
```

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                      GENERICS                                │
├─────────────────────────────────────────────────────────────┤
│ Constraints:                                                 │
│   where T : struct     - Value types only                   │
│   where T : class      - Reference types only               │
│   where T : new()      - Has parameterless constructor      │
│   where T : BaseClass  - Inherits from class                │
│   where T : IInterface - Implements interface               │
│   where T : notnull    - Non-nullable                       │
│   where T : unmanaged  - Blittable types (for pointers)     │
│                                                             │
│ Variance:                                                   │
│   out T = Covariant    (output only) - IEnumerable<Dog>→Animal │
│   in T  = Contravariant (input only) - Action<Animal>→Dog  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    DELEGATES                                 │
├─────────────────────────────────────────────────────────────┤
│ Built-in Types:                                             │
│   Action          - void return, 0-16 parameters            │
│   Action<T>       - void return, typed parameter            │
│   Func<TResult>   - returns value, 0-16 parameters          │
│   Func<T,TResult> - T in, TResult out                       │
│   Predicate<T>    - T in, bool out                          │
│                                                             │
│ Multicast:                                                  │
│   combined = d1 + d2;   // Combine                          │
│   combined -= d1;       // Remove                           │
│   Returns: Last delegate's return value only!               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      EVENTS                                  │
├─────────────────────────────────────────────────────────────┤
│ Declaration:                                                │
│   public event EventHandler<TArgs>? MyEvent;                │
│                                                             │
│ vs Delegate Field:                                          │
│   Event: Only owner invokes, subscribers use += / -=       │
│   Field: Anyone can invoke, replace, or clear               │
│                                                             │
│ Thread-safe invocation:                                     │
│   MyEvent?.Invoke(this, args);  // C# 6+ is safe            │
│                                                             │
│ Memory leak: Always unsubscribe when subscriber dies!       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 LAMBDAS & CLOSURES                           │
├─────────────────────────────────────────────────────────────┤
│ Syntax:                                                     │
│   x => x * 2              // Expression lambda              │
│   (x, y) => x + y         // Multiple params                │
│   () => 42                // No params                      │
│   x => { return x * 2; }  // Statement lambda               │
│                                                             │
│ Closure pitfall - loop variable:                            │
│   for (int i...) { list.Add(() => i); }  // BUG: all same!  │
│   Fix: int copy = i; list.Add(() => copy);                  │
│                                                             │
│ static lambda (C# 9+): Prevents accidental capture          │
│   static x => x * 2  // Error if captures anything          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    REFLECTION                                │
├─────────────────────────────────────────────────────────────┤
│ Get Type:                                                   │
│   typeof(MyClass)         // Compile-time                   │
│   obj.GetType()           // Runtime                        │
│   Type.GetType("name")    // From string                    │
│                                                             │
│ Get Members:                                                │
│   type.GetProperties()    // Public instance properties     │
│   type.GetMethods(flags)  // With BindingFlags              │
│   type.GetField("name", BindingFlags.NonPublic | Instance)  │
│                                                             │
│ Performance: 100-1000x slower than direct calls!            │
│   → Cache Type and MemberInfo                               │
│   → Use compiled delegates for hot paths                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 EXPRESSION TREES                             │
├─────────────────────────────────────────────────────────────┤
│ Expression vs Func:                                         │
│   Func<int,bool> fn = x => x > 5;   // Compiled code        │
│   Expression<Func<int,bool>> = x => x > 5; // Data tree     │
│                                                             │
│ Why they matter:                                            │
│   EF Core translates Expression to SQL                      │
│   IQueryable uses Expression trees                          │
│   IEnumerable uses compiled delegates                       │
│                                                             │
│ Building expressions:                                       │
│   var param = Expression.Parameter(typeof(int), "x");       │
│   var body = Expression.GreaterThan(param, Expression.Constant(5)); │
│   var lambda = Expression.Lambda<Func<int,bool>>(body, param); │
│   var compiled = lambda.Compile();                          │
└─────────────────────────────────────────────────────────────┘
```

## Key Interview Topics

1. **"Explain covariance and contravariance"**
   → See: `01-Generics.md` - Variance section

2. **"What's the difference between events and delegates?"**
   → See: `03-Events.md` - Events vs Delegates section

3. **"Explain closures and the loop variable trap"**
   → See: `04-LambdasClosures.md` - Closure section

4. **"How would you optimize reflection-heavy code?"**
   → See: `05-Reflection.md` - Performance section

5. **"How does Entity Framework translate LINQ to SQL?"**
   → See: `07-ExpressionTrees.md` - LINQ Providers section

## Practice Exercises

After reading each file:

1. **Generics**: Implement a generic `Result<T>` type with Success/Failure states
2. **Delegates**: Create a simple event aggregator/message bus
3. **Events**: Implement an observable collection with proper event cleanup
4. **Lambdas**: Find and fix closure bugs in a codebase
5. **Reflection**: Build a simple DI container that auto-resolves dependencies
6. **Attributes**: Create a validation framework using custom attributes
7. **Expressions**: Build a dynamic query builder for filtering entities

## Real-World Applications

| Topic | Used By |
|-------|---------|
| Generics | Collections, Repository Pattern, DI Containers |
| Delegates | LINQ, Event Handlers, Callbacks |
| Events | UI frameworks, Message Bus, Observer Pattern |
| Lambdas | LINQ, Async code, Functional patterns |
| Reflection | DI Containers, ORMs, Serializers |
| Attributes | Validation, Authorization, Documentation |
| Expression Trees | EF Core, AutoMapper, Specification Pattern |

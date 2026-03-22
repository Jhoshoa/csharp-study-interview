# Design Patterns

Design patterns are reusable solutions to common problems in software design.

## Categories

### Creational Patterns
How objects are created

| Pattern | Purpose | .NET Example |
|---------|---------|--------------|
| Singleton | Single instance | `IServiceCollection.AddSingleton<T>()` |
| Factory Method | Create objects without specifying class | `ILoggerFactory.CreateLogger()` |
| Abstract Factory | Create families of related objects | `DbProviderFactory` |
| Builder | Construct complex objects step by step | `StringBuilder`, `HostBuilder` |
| Prototype | Clone existing objects | `ICloneable` |

### Structural Patterns
How objects are composed

| Pattern | Purpose | .NET Example |
|---------|---------|--------------|
| Adapter | Convert interface to another | `StreamReader` wrapping `Stream` |
| Decorator | Add behavior dynamically | `BufferedStream` wrapping `Stream` |
| Facade | Simplified interface to complex system | `HttpClient` |
| Proxy | Placeholder for another object | Lazy loading proxies in EF |
| Composite | Tree structures | UI controls hierarchy |

### Behavioral Patterns
How objects interact

| Pattern | Purpose | .NET Example |
|---------|---------|--------------|
| Strategy | Swap algorithms at runtime | `IComparer<T>` |
| Observer | Notify subscribers of changes | Events, `IObservable<T>` |
| Command | Encapsulate request as object | `ICommand` in WPF |
| Iterator | Traverse collections | `IEnumerable<T>` |
| Template Method | Define algorithm skeleton | `Stream.CopyTo()` |
| Chain of Responsibility | Pass request along handlers | ASP.NET Middleware |

## Files to Create

- `Creational/Singleton.md`
- `Creational/Factory.md`
- `Creational/Builder.md`
- `Structural/Adapter.md`
- `Structural/Decorator.md`
- `Behavioral/Strategy.md`
- `Behavioral/Observer.md`
- `Behavioral/Repository.md`

## Most Important for Senior .NET Engineers

1. **Repository Pattern** - Data access abstraction
2. **Unit of Work** - Transaction management
3. **Strategy Pattern** - Configurable behavior (DI)
4. **Factory Pattern** - Object creation
5. **Decorator Pattern** - Adding cross-cutting concerns
6. **Observer Pattern** - Event-driven systems

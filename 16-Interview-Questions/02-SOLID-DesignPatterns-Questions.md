# SOLID & Design Patterns Interview Questions

## SOLID Principles

### Single Responsibility Principle (SRP)

**Q: Explain SRP and give an example of violation and fix.**

A: A class should have only one reason to change.

```csharp
// VIOLATION - Multiple responsibilities
public class UserService
{
    public void CreateUser(User user) { /* ... */ }
    public void SendEmail(User user) { /* ... */ }      // Email responsibility
    public void LogActivity(string msg) { /* ... */ }   // Logging responsibility
}

// FIXED - Separated concerns
public class UserService
{
    private readonly IEmailService _emailService;
    private readonly ILogger _logger;

    public UserService(IEmailService emailService, ILogger logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public void CreateUser(User user)
    {
        // Only user creation logic
        _emailService.SendWelcomeEmail(user);
        _logger.Log("User created");
    }
}
```

---

### Open/Closed Principle (OCP)

**Q: How would you make a class open for extension but closed for modification?**

A: Use abstractions and polymorphism.

```csharp
// VIOLATION - Must modify class to add new discount types
public class DiscountCalculator
{
    public decimal Calculate(string type, decimal amount)
    {
        if (type == "Regular") return amount * 0.1m;
        if (type == "Premium") return amount * 0.2m;
        // Must add new if for each type
        return 0;
    }
}

// FIXED - Extend without modifying
public interface IDiscountStrategy
{
    decimal Calculate(decimal amount);
}

public class RegularDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal amount) => amount * 0.1m;
}

public class PremiumDiscount : IDiscountStrategy
{
    public decimal Calculate(decimal amount) => amount * 0.2m;
}

public class DiscountCalculator
{
    public decimal Calculate(IDiscountStrategy strategy, decimal amount)
        => strategy.Calculate(amount);
}
```

---

### Liskov Substitution Principle (LSP)

**Q: What is LSP? Give a classic violation example.**

A: Derived classes must be substitutable for their base classes.

```csharp
// VIOLATION - Classic Rectangle/Square problem
public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }
    public int Area => Width * Height;
}

public class Square : Rectangle
{
    public override int Width
    {
        set { base.Width = base.Height = value; }
    }
    public override int Height
    {
        set { base.Width = base.Height = value; }
    }
}

// This breaks when substituting Square for Rectangle
void Resize(Rectangle rect)
{
    rect.Width = 5;
    rect.Height = 10;
    // Expected: Area = 50, but Square gives Area = 100
}
```

---

### Interface Segregation Principle (ISP)

**Q: What is ISP and why is it important?**

A: Clients should not be forced to depend on methods they don't use.

```csharp
// VIOLATION - Fat interface
public interface IWorker
{
    void Work();
    void Eat();
    void Sleep();
}

public class Robot : IWorker
{
    public void Work() { /* ... */ }
    public void Eat() { throw new NotImplementedException(); } // Robots don't eat!
    public void Sleep() { throw new NotImplementedException(); }
}

// FIXED - Segregated interfaces
public interface IWorkable { void Work(); }
public interface IFeedable { void Eat(); }
public interface ISleepable { void Sleep(); }

public class Human : IWorkable, IFeedable, ISleepable { /* ... */ }
public class Robot : IWorkable { /* ... */ }
```

---

### Dependency Inversion Principle (DIP)

**Q: Explain DIP and its relationship with Dependency Injection.**

A: High-level modules should not depend on low-level modules. Both should depend on abstractions.

```csharp
// VIOLATION - Direct dependency on concrete class
public class OrderService
{
    private readonly SqlDatabase _database = new SqlDatabase(); // Tight coupling

    public void SaveOrder(Order order)
    {
        _database.Save(order);
    }
}

// FIXED - Depend on abstraction
public interface IDatabase
{
    void Save<T>(T entity);
}

public class OrderService
{
    private readonly IDatabase _database;

    public OrderService(IDatabase database) // Injected dependency
    {
        _database = database;
    }

    public void SaveOrder(Order order)
    {
        _database.Save(order);
    }
}
```

---

## Design Patterns

### Singleton Pattern

**Q: Implement a thread-safe Singleton. What are the drawbacks?**

A:
```csharp
public sealed class Singleton
{
    private static readonly Lazy<Singleton> _instance =
        new Lazy<Singleton>(() => new Singleton());

    private Singleton() { }

    public static Singleton Instance => _instance.Value;
}

// Drawbacks:
// - Tight coupling
// - Difficult to test/mock
// - Hidden dependencies
// - Global state
```

---

### Factory Pattern

**Q: When would you use Factory vs Abstract Factory?**

A:
```csharp
// Factory Method - Creates one type of object
public interface IVehicleFactory
{
    IVehicle CreateVehicle();
}

public class CarFactory : IVehicleFactory
{
    public IVehicle CreateVehicle() => new Car();
}

// Abstract Factory - Creates family of related objects
public interface IFurnitureFactory
{
    IChair CreateChair();
    ITable CreateTable();
    ISofa CreateSofa();
}

public class ModernFurnitureFactory : IFurnitureFactory
{
    public IChair CreateChair() => new ModernChair();
    public ITable CreateTable() => new ModernTable();
    public ISofa CreateSofa() => new ModernSofa();
}
```

---

### Repository Pattern

**Q: Implement a generic repository. What are pros and cons?**

A:
```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

public class Repository<T> : IRepository<T> where T : class
{
    private readonly DbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
        => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public async Task AddAsync(T entity)
        => await _dbSet.AddAsync(entity);

    // ... etc
}

// Pros: Abstraction over data access, testability, DRY
// Cons: Can become leaky abstraction, may add unnecessary complexity
```

---

### Strategy Pattern

**Q: When would you use the Strategy pattern?**

A: When you need to swap algorithms at runtime.

```csharp
public interface IPaymentStrategy
{
    void Pay(decimal amount);
}

public class CreditCardPayment : IPaymentStrategy
{
    public void Pay(decimal amount) => Console.WriteLine($"Paid ${amount} via Credit Card");
}

public class PayPalPayment : IPaymentStrategy
{
    public void Pay(decimal amount) => Console.WriteLine($"Paid ${amount} via PayPal");
}

public class ShoppingCart
{
    public void Checkout(decimal total, IPaymentStrategy paymentStrategy)
    {
        paymentStrategy.Pay(total);
    }
}

// Usage
var cart = new ShoppingCart();
cart.Checkout(100, new CreditCardPayment());
cart.Checkout(200, new PayPalPayment());
```

---

### Observer Pattern

**Q: How does the Observer pattern differ from events in C#?**

A: C# events are a language-level implementation of Observer pattern.

```csharp
// Observer pattern with interfaces
public interface IObserver
{
    void Update(string message);
}

public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify();
}

// C# events - simpler syntax
public class Stock
{
    public event EventHandler<decimal>? PriceChanged;

    private decimal _price;
    public decimal Price
    {
        get => _price;
        set
        {
            _price = value;
            PriceChanged?.Invoke(this, value);
        }
    }
}
```

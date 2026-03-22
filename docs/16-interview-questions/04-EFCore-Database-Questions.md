# Entity Framework Core & Database Interview Questions

## EF Core Basics

**Q: What is EF Core and what are the different approaches?**

A:
- **Code-First**: Define entities in C#, generate database
- **Database-First**: Scaffold entities from existing database

```csharp
// Code-First Entity
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navigation properties
    public ICollection<Order> Orders { get; set; }
}

// DbContext
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
        });
    }
}
```

---

## Tracking vs No-Tracking

**Q: What is change tracking and when to use no-tracking queries?**

A:
```csharp
// Default: Tracked - EF monitors changes
var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
user.Name = "New Name";
await _context.SaveChangesAsync(); // Updates automatically

// No-Tracking: Read-only, better performance
var users = await _context.Users
    .AsNoTracking()
    .ToListAsync();

// Global no-tracking (read-heavy apps)
services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)
           .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));
```

---

## Eager, Lazy, and Explicit Loading

**Q: Explain the three loading strategies.**

A:
```csharp
// Eager Loading - Load related data immediately
var users = await _context.Users
    .Include(u => u.Orders)
        .ThenInclude(o => o.OrderItems)
    .ToListAsync();

// Lazy Loading - Load related data on access (requires proxies)
// Enable in DbContext configuration
services.AddDbContext<AppDbContext>(options =>
    options.UseLazyLoadingProxies()
           .UseSqlServer(connectionString));

public class User
{
    public virtual ICollection<Order> Orders { get; set; } // Must be virtual
}

// Explicit Loading - Load related data on demand
var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
await _context.Entry(user)
    .Collection(u => u.Orders)
    .LoadAsync();
```

| Strategy | Pros | Cons |
|----------|------|------|
| Eager | Fewer queries, predictable | Over-fetching |
| Lazy | Simple code | N+1 problem, unexpected queries |
| Explicit | Control over loading | More code |

---

## N+1 Problem

**Q: What is the N+1 problem and how to solve it?**

A:
```csharp
// N+1 Problem - 1 query for users + N queries for orders
var users = await _context.Users.ToListAsync();
foreach (var user in users)
{
    Console.WriteLine(user.Orders.Count); // Each access = new query!
}

// Solution 1: Eager loading
var users = await _context.Users
    .Include(u => u.Orders)
    .ToListAsync();

// Solution 2: Projection
var userData = await _context.Users
    .Select(u => new
    {
        u.Name,
        OrderCount = u.Orders.Count
    })
    .ToListAsync();

// Solution 3: Split queries (for large includes)
var users = await _context.Users
    .Include(u => u.Orders)
    .AsSplitQuery()
    .ToListAsync();
```

---

## Migrations

**Q: How do migrations work?**

A:
```bash
# Create migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update

# Generate SQL script
dotnet ef migrations script

# Revert migration
dotnet ef database update PreviousMigration
```

```csharp
// Migration file
public partial class AddUserEmail : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Email",
            table: "Users",
            type: "nvarchar(256)",
            maxLength: 256,
            nullable: false,
            defaultValue: "");

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(name: "IX_Users_Email", table: "Users");
        migrationBuilder.DropColumn(name: "Email", table: "Users");
    }
}
```

---

## Transactions

**Q: How do you handle transactions in EF Core?**

A:
```csharp
// Implicit transaction - SaveChanges wraps all changes
user.Name = "New Name";
order.Status = "Completed";
await _context.SaveChangesAsync(); // Both or neither

// Explicit transaction - Multiple SaveChanges
using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    _context.Orders.Add(order);
    await _context.SaveChangesAsync();

    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}

// Cross-context transaction
using var connection = new SqlConnection(connectionString);
await connection.OpenAsync();
using var transaction = connection.BeginTransaction();

var options1 = new DbContextOptionsBuilder<Context1>()
    .UseSqlServer(connection).Options;
var options2 = new DbContextOptionsBuilder<Context2>()
    .UseSqlServer(connection).Options;

using var context1 = new Context1(options1);
using var context2 = new Context2(options2);

context1.Database.UseTransaction(transaction);
context2.Database.UseTransaction(transaction);
```

---

## Raw SQL

**Q: How do you execute raw SQL in EF Core?**

A:
```csharp
// Query with entity mapping
var users = await _context.Users
    .FromSqlRaw("SELECT * FROM Users WHERE Status = {0}", status)
    .ToListAsync();

// Interpolated (safer)
var users = await _context.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Email = {email}")
    .ToListAsync();

// Non-query commands
await _context.Database.ExecuteSqlRawAsync(
    "UPDATE Users SET LastLogin = {0} WHERE Id = {1}",
    DateTime.UtcNow, userId);

// Stored procedure
var users = await _context.Users
    .FromSqlRaw("EXEC GetActiveUsers @DepartmentId = {0}", deptId)
    .ToListAsync();
```

---

## Query Optimization

**Q: How do you optimize EF Core queries?**

A:
```csharp
// 1. Use projection - don't fetch entire entities
var names = await _context.Users
    .Where(u => u.IsActive)
    .Select(u => new { u.Id, u.Name })
    .ToListAsync();

// 2. Use pagination
var page = await _context.Users
    .OrderBy(u => u.Id)
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();

// 3. Use compiled queries for hot paths
private static readonly Func<AppDbContext, int, Task<User?>> GetUserById =
    EF.CompileAsyncQuery((AppDbContext ctx, int id) =>
        ctx.Users.FirstOrDefault(u => u.Id == id));

// Usage
var user = await GetUserById(_context, id);

// 4. Batch operations (EF Core 7+)
await _context.Users
    .Where(u => u.LastLogin < cutoffDate)
    .ExecuteDeleteAsync();

await _context.Users
    .Where(u => u.Status == "Pending")
    .ExecuteUpdateAsync(u => u.SetProperty(x => x.Status, "Active"));
```

---

## SQL vs NoSQL

**Q: When would you choose SQL vs NoSQL?**

A:

| SQL (Relational) | NoSQL (Document/Key-Value) |
|------------------|---------------------------|
| ACID compliance needed | Eventual consistency OK |
| Complex relationships | Denormalized data |
| Complex queries/joins | Simple lookups |
| Structured data | Flexible schema |
| Transactions | High write throughput |

```csharp
// SQL - EF Core with relationships
var orderWithDetails = await _context.Orders
    .Include(o => o.Customer)
    .Include(o => o.Items)
    .ThenInclude(i => i.Product)
    .FirstOrDefaultAsync(o => o.Id == id);

// NoSQL - MongoDB with denormalized document
var order = await _mongoCollection.Find(o => o.Id == id).FirstOrDefaultAsync();
// Order document contains embedded Customer and Items
```

# ASP.NET Core Web API

ASP.NET Core is a cross-platform, high-performance framework for building modern, cloud-enabled web applications and APIs. Understanding its architecture and patterns is essential for building scalable, maintainable backend services.

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "ASP.NET Core Architecture" as arch #LightBlue {

  rectangle "HTTP Request" as request #LightGreen {
    card "Client Request"
    card "HTTP Methods"
    card "Headers/Body"
  }

  rectangle "Kestrel Server" as kestrel #LightYellow {
    card "High-performance"
    card "Cross-platform"
    card "HTTP/1.1, HTTP/2, HTTP/3"
  }

  rectangle "Middleware Pipeline" as middleware #LightCoral {
    card "Authentication"
    card "Routing"
    card "Exception Handling"
    card "CORS"
    card "Custom Middleware"
  }

  rectangle "Endpoint Routing" as routing #LightPink {
    card "Controllers"
    card "Minimal APIs"
    card "SignalR Hubs"
    card "gRPC Services"
  }

  rectangle "HTTP Response" as response #Wheat {
    card "Status Code"
    card "Headers"
    card "Body (JSON/XML)"
  }

  request --> kestrel
  kestrel --> middleware
  middleware --> routing
  routing --> response

}

note bottom of arch
  Modular, testable architecture
  with dependency injection built-in
end note
@enduml
```

## What is ASP.NET Core Web API?

ASP.NET Core Web API is a framework for building RESTful HTTP services that can be consumed by various clients including browsers, mobile apps, and other services. It provides:

1. **Cross-Platform** - Runs on Windows, Linux, and macOS
2. **High Performance** - One of the fastest web frameworks available
3. **Built-in DI** - Dependency injection is a first-class citizen
4. **Middleware Pipeline** - Composable request/response processing
5. **Flexible Hosting** - Kestrel, IIS, Docker, cloud platforms

## Request Pipeline

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "Request Pipeline" as pipeline {

  rectangle "Incoming Request" as req #LightGreen

  rectangle "Middleware 1\n(Logging)" as m1 #LightYellow
  rectangle "Middleware 2\n(Exception Handler)" as m2 #LightYellow
  rectangle "Middleware 3\n(Authentication)" as m3 #LightYellow
  rectangle "Middleware 4\n(Authorization)" as m4 #LightYellow
  rectangle "Middleware 5\n(Routing)" as m5 #LightYellow

  rectangle "Endpoint\n(Controller/Minimal API)" as endpoint #LightCoral

  rectangle "Outgoing Response" as res #LightGreen

  req --> m1
  m1 --> m2
  m2 --> m3
  m3 --> m4
  m4 --> m5
  m5 --> endpoint
  endpoint --> m5
  m5 --> m4
  m4 --> m3
  m3 --> m2
  m2 --> m1
  m1 --> res

}

note right of pipeline
  Each middleware can:
  - Process the request
  - Call the next middleware
  - Process the response
  - Short-circuit the pipeline
end note
@enduml
```

## Key Components

| Component | Purpose | Document |
|-----------|---------|----------|
| **Request Pipeline** | Process HTTP requests through middleware | [01-Fundamentals.md](./01-Fundamentals.md) |
| **Controllers** | Handle HTTP requests and return responses | [02-Controllers.md](./02-Controllers.md) |
| **Middleware** | Cross-cutting concerns (auth, logging, etc.) | [03-Middleware.md](./03-Middleware.md) |
| **Authentication** | Identity verification and authorization | [04-Authentication.md](./04-Authentication.md) |
| **Error Handling** | Exception handling and problem details | [05-ErrorHandling.md](./05-ErrorHandling.md) |
| **Performance** | Caching, compression, optimization | [06-Performance.md](./06-Performance.md) |

## Minimal API vs Controllers

ASP.NET Core offers two approaches for building APIs:

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "API Approaches" as approaches #LightBlue {

  rectangle "Controllers" as controllers #LightGreen {
    card "Traditional MVC pattern"
    card "Attribute routing"
    card "Model binding built-in"
    card "Filters (action, exception)"
    card "Better for complex APIs"
  }

  rectangle "Minimal APIs" as minimal #LightYellow {
    card "Lambda-based endpoints"
    card "Less ceremony"
    card "Faster startup"
    card "Good for microservices"
    card "Introduced in .NET 6"
  }

}

note bottom of approaches
  Both approaches can coexist
  in the same application
end note
@enduml
```

### Quick Comparison

```csharp
// Controller-based API
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var product = await _service.GetByIdAsync(id);
        if (product == null) return NotFound();
        return product;
    }
}

// Minimal API (same endpoint)
app.MapGet("/api/products/{id}", async (int id, IProductService service) =>
{
    var product = await service.GetByIdAsync(id);
    return product is not null ? Results.Ok(product) : Results.NotFound();
});
```

## Files in This Section

| File | Topics Covered |
|------|----------------|
| [01-Fundamentals.md](./01-Fundamentals.md) | Request pipeline, routing, configuration, environments |
| [02-Controllers.md](./02-Controllers.md) | Controllers, actions, model binding, validation, filters |
| [03-Middleware.md](./03-Middleware.md) | Built-in middleware, custom middleware, middleware ordering |
| [04-Authentication.md](./04-Authentication.md) | JWT, OAuth 2.0, authorization policies, claims |
| [05-ErrorHandling.md](./05-ErrorHandling.md) | Global exception handling, problem details, logging |
| [06-Performance.md](./06-Performance.md) | Response caching, output caching, compression, rate limiting |

## Application Startup

```csharp
// Program.cs (.NET 6+ minimal hosting)
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register your services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────────┐
│                 ASP.NET Core Web API Quick Reference                │
├─────────────────────────────────────────────────────────────────────┤
│ HTTP Methods:                                                        │
│   GET     - Retrieve resources                                       │
│   POST    - Create new resources                                     │
│   PUT     - Update/replace resources                                 │
│   PATCH   - Partial update                                          │
│   DELETE  - Remove resources                                         │
├─────────────────────────────────────────────────────────────────────┤
│ Status Codes:                                                        │
│   200 OK           - Success                                         │
│   201 Created      - Resource created                                │
│   204 No Content   - Success, no body                                │
│   400 Bad Request  - Invalid input                                   │
│   401 Unauthorized - Authentication required                         │
│   403 Forbidden    - Not allowed                                     │
│   404 Not Found    - Resource doesn't exist                          │
│   500 Server Error - Internal error                                  │
├─────────────────────────────────────────────────────────────────────┤
│ Common Attributes:                                                   │
│   [ApiController]  - Enables API behaviors                           │
│   [Route]          - Define URL pattern                              │
│   [HttpGet/Post]   - HTTP method binding                             │
│   [FromBody]       - Bind from request body                          │
│   [FromQuery]      - Bind from query string                          │
│   [FromRoute]      - Bind from route values                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Common Interview Topics

1. **What is the middleware pipeline?** - Request/response processing chain
2. **Difference between AddScoped, AddTransient, AddSingleton?** - Service lifetimes
3. **How does routing work?** - Attribute routing, conventional routing
4. **What is model binding?** - Automatic mapping of HTTP data to parameters
5. **How to handle errors globally?** - Exception middleware, problem details
6. **How to implement authentication?** - JWT, OAuth 2.0, Identity
7. **What are filters?** - Action filters, exception filters, result filters


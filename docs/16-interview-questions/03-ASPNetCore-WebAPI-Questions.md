# ASP.NET Core & Web API Interview Questions

## Middleware

**Q: What is middleware and how does the pipeline work?**

A: Middleware are components that handle requests/responses in a pipeline.

```csharp
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation($"Request: {context.Request.Path}");

        await _next(context); // Call next middleware

        _logger.LogInformation($"Response: {context.Response.StatusCode}");
    }
}

// Registration in Program.cs
app.UseMiddleware<RequestLoggingMiddleware>();

// Order matters!
app.UseAuthentication();  // 1st
app.UseAuthorization();   // 2nd
app.MapControllers();     // 3rd
```

---

## Dependency Injection

**Q: Explain the three DI lifetimes in ASP.NET Core.**

A:
- **Transient**: New instance every time requested
- **Scoped**: One instance per HTTP request
- **Singleton**: One instance for application lifetime

```csharp
builder.Services.AddTransient<ITransientService, TransientService>();
builder.Services.AddScoped<IScopedService, ScopedService>();
builder.Services.AddSingleton<ISingletonService, SingletonService>();

// Common mistake: Injecting Scoped into Singleton
// This causes "captive dependency" - scoped acts like singleton
```

| Lifetime | Use Case |
|----------|----------|
| Transient | Lightweight, stateless services |
| Scoped | DbContext, Unit of Work, per-request state |
| Singleton | Configuration, Caching, HttpClient |

---

## Filters

**Q: What types of filters exist and in what order do they run?**

A:
1. Authorization filters
2. Resource filters
3. Action filters
4. Exception filters
5. Result filters

```csharp
public class ValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}

// Global registration
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// Or attribute-based
[ServiceFilter(typeof(ValidationFilter))]
public class UsersController : ControllerBase { }
```

---

## Authentication vs Authorization

**Q: Explain the difference and how to implement JWT authentication.**

A:
- **Authentication**: Who are you? (Identity)
- **Authorization**: What can you do? (Permissions)

```csharp
// Program.cs - JWT Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "your-issuer",
            ValidAudience = "your-audience",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("your-secret-key"))
        };
    });

// Generate token
public string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: _config["Jwt:Issuer"],
        audience: _config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}

// Controller usage
[Authorize]
[HttpGet("protected")]
public IActionResult GetProtectedData() { }

[Authorize(Roles = "Admin")]
[HttpDelete("{id}")]
public IActionResult DeleteUser(int id) { }
```

---

## Model Binding & Validation

**Q: How does model binding work and how do you implement custom validation?**

A:
```csharp
public class CreateUserDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; }

    [Compare("Password", ErrorMessage = "Passwords don't match")]
    public string ConfirmPassword { get; set; }
}

// Custom validation attribute
public class MinAgeAttribute : ValidationAttribute
{
    private readonly int _minAge;

    public MinAgeAttribute(int minAge) => _minAge = minAge;

    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        if (value is DateTime birthDate)
        {
            var age = DateTime.Today.Year - birthDate.Year;
            if (age < _minAge)
                return new ValidationResult($"Minimum age is {_minAge}");
        }
        return ValidationResult.Success;
    }
}

// Usage
[MinAge(18)]
public DateTime BirthDate { get; set; }
```

---

## API Versioning

**Q: How would you implement API versioning?**

A:
```csharp
// Install: Microsoft.AspNetCore.Mvc.Versioning

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"),
        new QueryStringApiVersionReader("api-version")
    );
});

// URL versioning: /api/v1/users
[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class UsersV1Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("Version 1");
}

[ApiVersion("2.0")]
public class UsersV2Controller : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok("Version 2 with more data");
}
```

---

## Minimal APIs

**Q: What are Minimal APIs and when to use them?**

A: Lightweight approach to building APIs without controllers.

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Simple endpoint
app.MapGet("/", () => "Hello World!");

// With parameters and DI
app.MapGet("/users/{id}", async (int id, IUserService userService) =>
{
    var user = await userService.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

// With validation
app.MapPost("/users", async (CreateUserDto dto, IUserService service) =>
{
    var user = await service.CreateAsync(dto);
    return Results.Created($"/users/{user.Id}", user);
})
.WithName("CreateUser")
.Produces<User>(StatusCodes.Status201Created)
.ProducesValidationProblem();

app.Run();
```

---

## Global Exception Handling

**Q: How do you implement global exception handling?**

A:
```csharp
// Exception handling middleware
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            NotFoundException => (404, "Resource not found"),
            ValidationException => (400, "Validation failed"),
            UnauthorizedException => (401, "Unauthorized"),
            _ => (500, "Internal server error")
        };

        context.Response.StatusCode = statusCode;

        return context.Response.WriteAsJsonAsync(new
        {
            StatusCode = statusCode,
            Message = message
        });
    }
}
```

---

## CORS

**Q: How do you configure CORS?**

A:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("https://myapp.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

app.UseCors("AllowSpecificOrigin");

// Or per-controller
[EnableCors("AllowSpecificOrigin")]
public class ApiController : ControllerBase { }
```

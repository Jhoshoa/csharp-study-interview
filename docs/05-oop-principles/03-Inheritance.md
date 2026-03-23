# Inheritance - Building on What Exists

## What is Inheritance?

Inheritance allows a class (derived/child) to acquire properties and behaviors from another class (base/parent). It establishes an **IS-A** relationship.

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

class Animal {
  #name: string
  #age: int
  +Eat(): void
  +Sleep(): void
}

class Mammal {
  #bodyTemperature: double
  +Breathe(): void
  +Nurse(): void
}

class Dog {
  -breed: string
  +Bark(): void
  +Fetch(): void
}

class Cat {
  -isIndoor: bool
  +Meow(): void
  +Scratch(): void
}

Animal <|-- Mammal : IS-A
Mammal <|-- Dog : IS-A
Mammal <|-- Cat : IS-A

note right of Dog
  Dog IS-A Mammal
  Dog IS-A Animal

  Dog HAS all members from:
  - Animal
  - Mammal
  - Dog
end note
@enduml
```

## Inheritance in C#

### Basic Syntax

```csharp
// Base class
public class Vehicle
{
    public string Brand { get; set; }
    public int Year { get; set; }

    public virtual void Start()
    {
        Console.WriteLine("Vehicle starting...");
    }

    public void Stop()
    {
        Console.WriteLine("Vehicle stopping...");
    }
}

// Derived class
public class Car : Vehicle
{
    public int NumberOfDoors { get; set; }

    // Override base behavior
    public override void Start()
    {
        Console.WriteLine("Car engine starting...");
        base.Start();  // Optionally call base implementation
    }

    // New method specific to Car
    public void Honk()
    {
        Console.WriteLine("Beep beep!");
    }
}

// Further derived class
public class ElectricCar : Car
{
    public int BatteryCapacity { get; set; }

    public override void Start()
    {
        Console.WriteLine("Electric motor starting silently...");
    }

    public void Charge()
    {
        Console.WriteLine("Charging battery...");
    }
}
```

## Constructor Chain

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

participant "new ElectricCar()" as caller
participant "ElectricCar" as ec
participant "Car" as car
participant "Vehicle" as vehicle
participant "Object" as obj

caller -> ec : 1. Create ElectricCar
activate ec

ec -> car : 2. Call Car constructor
activate car

car -> vehicle : 3. Call Vehicle constructor
activate vehicle

vehicle -> obj : 4. Call Object constructor
activate obj
obj --> vehicle : return
deactivate obj

vehicle --> car : return
deactivate vehicle

car --> ec : return
deactivate car

ec --> caller : return instance
deactivate ec

note right of caller
  Constructors execute
  from base to derived
end note
@enduml
```

```csharp
public class Animal
{
    public string Name { get; }

    public Animal(string name)
    {
        Console.WriteLine("Animal constructor");
        Name = name;
    }
}

public class Dog : Animal
{
    public string Breed { get; }

    // Must call base constructor explicitly when base has no parameterless constructor
    public Dog(string name, string breed) : base(name)
    {
        Console.WriteLine("Dog constructor");
        Breed = breed;
    }
}

public class Labrador : Dog
{
    public string Color { get; }

    public Labrador(string name, string color)
        : base(name, "Labrador")  // Calls Dog constructor
    {
        Console.WriteLine("Labrador constructor");
        Color = color;
    }
}

// Output when creating new Labrador("Max", "Yellow"):
// Animal constructor
// Dog constructor
// Labrador constructor
```

## Virtual, Override, and New Keywords

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

class Base {
  +NormalMethod()
  +{abstract} AbstractMethod()
  +virtual VirtualMethod()
  +SealedMethod()
}

class Derived {
  +NormalMethod()
  +override AbstractMethod()
  +override VirtualMethod()
  +new SealedMethod()
}

Base <|-- Derived

note right of Base::VirtualMethod
  **virtual**: CAN be overridden
  Runtime polymorphism
end note

note right of Base::AbstractMethod
  **abstract**: MUST be overridden
  No implementation in base
end note

note right of Derived::SealedMethod
  **new**: Hides base method
  Compile-time binding
  Usually a code smell!
end note
@enduml
```

### The Difference: Override vs New

```csharp
public class Animal
{
    public virtual void Speak() => Console.WriteLine("Animal speaks");
    public void Move() => Console.WriteLine("Animal moves");
}

public class Dog : Animal
{
    public override void Speak() => Console.WriteLine("Dog barks");  // Override
    public new void Move() => Console.WriteLine("Dog runs");          // Hide
}

// Usage - THE CRITICAL DIFFERENCE
Animal animal = new Dog();  // Reference type is Animal

animal.Speak();  // Output: "Dog barks"  (runtime polymorphism)
animal.Move();   // Output: "Animal moves" (compile-time binding!)

Dog dog = new Dog();
dog.Speak();     // Output: "Dog barks"
dog.Move();      // Output: "Dog runs"
```

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "override" as over #LightGreen {
  card "Runtime polymorphism"
  card "Method lookup at runtime"
  card "Respects actual object type"
  card "Uses virtual table (vtable)"
}

rectangle "new (hiding)" as newhide #LightCoral {
  card "Compile-time binding"
  card "Method chosen by reference type"
  card "Base method still accessible"
  card "Usually indicates design problem"
}

note bottom of over
  Animal a = new Dog();
  a.Speak(); → "Dog barks"
end note

note bottom of newhide
  Animal a = new Dog();
  a.Move(); → "Animal moves" !!!
end note
@enduml
```

## Sealed Classes and Methods

```csharp
// Sealed class - cannot be inherited
public sealed class String
{
    // ...
}

// public class MyString : String { }  // ❌ Compile error

// Sealed method - cannot be further overridden
public class Animal
{
    public virtual void Eat() => Console.WriteLine("Eating");
}

public class Mammal : Animal
{
    public sealed override void Eat()  // Can be overridden, but seals it
    {
        Console.WriteLine("Mammal eating");
    }
}

public class Dog : Mammal
{
    // public override void Eat() { }  // ❌ Compile error - Eat is sealed
}
```

### When to Seal

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "Seal When" as seal #LightGreen {
  card "Security-critical classes"
  card "Performance optimization"
  card "Class not designed for inheritance"
  card "Preventing incorrect override"
}

rectangle "Don't Seal When" as noseal #LightYellow {
  card "Framework/library code"
  card "Expecting extension"
  card "Following OCP"
}

note bottom of seal
  Examples:
  - String, ValueType
  - Security managers
  - Final implementations
end note
@enduml
```

## Protected Members

```csharp
public class BankAccount
{
    private decimal _balance;                    // Only this class
    protected string AccountNumber { get; }     // This + derived classes
    protected internal int BranchCode { get; }  // This + derived + same assembly

    protected BankAccount(string accountNumber)
    {
        AccountNumber = accountNumber;
    }

    protected virtual void OnBalanceChanged(decimal oldBalance, decimal newBalance)
    {
        // Hook for derived classes
    }

    public void Deposit(decimal amount)
    {
        var old = _balance;
        _balance += amount;
        OnBalanceChanged(old, _balance);
    }
}

public class SavingsAccount : BankAccount
{
    private decimal _interestRate;

    public SavingsAccount(string accountNumber, decimal interestRate)
        : base(accountNumber)
    {
        _interestRate = interestRate;
        // Can access AccountNumber here (protected)
        Console.WriteLine($"Created savings account: {AccountNumber}");
    }

    protected override void OnBalanceChanged(decimal oldBalance, decimal newBalance)
    {
        // Custom logic for savings account
        if (newBalance > 10000)
            Console.WriteLine("You qualify for premium interest!");
    }
}
```

## Inheritance Hierarchy Design

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

abstract class Shape {
  #x: double
  #y: double
  +{abstract} Area(): double
  +{abstract} Perimeter(): double
  +Move(dx, dy): void
}

abstract class Polygon {
  #vertices: Point[]
  +VertexCount: int
}

class Circle {
  -radius: double
  +Area(): double
  +Perimeter(): double
}

class Rectangle {
  -width: double
  -height: double
  +Area(): double
  +Perimeter(): double
}

class Square {
  +Square(side: double)
}

class Triangle {
  +Area(): double
  +Perimeter(): double
}

Shape <|-- Circle
Shape <|-- Polygon
Polygon <|-- Rectangle
Polygon <|-- Triangle
Rectangle <|-- Square : Controversial!

note right of Square
  Square IS-A Rectangle?

  Mathematically: Yes
  OOP (LSP): Problematic!

  Rectangle.SetWidth() breaks
  Square invariant
end note
@enduml
```

### The Square-Rectangle Problem (LSP Violation)

```csharp
// ❌ PROBLEMATIC design
public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }

    public int Area() => Width * Height;
}

public class Square : Rectangle
{
    public override int Width
    {
        get => base.Width;
        set { base.Width = value; base.Height = value; }
    }

    public override int Height
    {
        get => base.Height;
        set { base.Height = value; base.Width = value; }
    }
}

// This breaks Liskov Substitution Principle!
void ProcessRectangle(Rectangle r)
{
    r.Width = 5;
    r.Height = 10;
    Debug.Assert(r.Area() == 50);  // Fails for Square!
}

// ✅ BETTER: Use composition or separate types
public interface IShape
{
    double Area { get; }
}

public class Rectangle : IShape
{
    public int Width { get; }
    public int Height { get; }
    public double Area => Width * Height;

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }
}

public class Square : IShape
{
    public int Side { get; }
    public double Area => Side * Side;

    public Square(int side) => Side = side;
}
```

## Multiple Inheritance - C# Solution

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

interface IFlyable {
  +Fly(): void
}

interface ISwimmable {
  +Swim(): void
}

interface IWalkable {
  +Walk(): void
}

class Duck {
  +Fly(): void
  +Swim(): void
  +Walk(): void
}

class Penguin {
  +Swim(): void
  +Walk(): void
}

class Sparrow {
  +Fly(): void
  +Walk(): void
}

IFlyable <|.. Duck
ISwimmable <|.. Duck
IWalkable <|.. Duck

ISwimmable <|.. Penguin
IWalkable <|.. Penguin

IFlyable <|.. Sparrow
IWalkable <|.. Sparrow

note bottom of Duck
  C# doesn't support multiple class inheritance
  But supports multiple interface implementation
end note
@enduml
```

```csharp
public interface IFlyable
{
    void Fly();
    int MaxAltitude { get; }
}

public interface ISwimmable
{
    void Swim();
    int MaxDepth { get; }
}

// Duck implements multiple interfaces
public class Duck : IFlyable, ISwimmable
{
    public int MaxAltitude => 1000;
    public int MaxDepth => 5;

    public void Fly() => Console.WriteLine("Duck flying");
    public void Swim() => Console.WriteLine("Duck swimming");
}

// Using default interface methods (C# 8+)
public interface ILogger
{
    void Log(string message);

    // Default implementation
    void LogError(string message) => Log($"ERROR: {message}");
    void LogWarning(string message) => Log($"WARNING: {message}");
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
    // LogError and LogWarning work without implementation!
}
```

## Interview Questions & Answers

### Q1: Can constructors be inherited?

**Answer**: No, constructors are NOT inherited. Each class must define its own constructors. However, derived class constructors must call a base class constructor (explicitly or implicitly via parameterless constructor).

### Q2: What's the difference between `is-a` and `has-a`?

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "IS-A (Inheritance)" as isa #LightBlue {
  class Car
  class Vehicle
  Car -up-|> Vehicle : extends
}

rectangle "HAS-A (Composition)" as hasa #LightGreen {
  class Car2 as "Car"
  class Engine
  Car2 *--> Engine : contains
}

note bottom of isa
  Car IS-A Vehicle
  Strong coupling
  Compile-time relationship
end note

note bottom of hasa
  Car HAS-A Engine
  Loose coupling
  Runtime flexibility
end note
@enduml
```

### Q3: Why is multiple inheritance not allowed in C#?

**Answer**: Multiple class inheritance creates the **Diamond Problem**:

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

class A {
  +Method(): void
}

class B {
  +Method(): void
}

class C {
  +Method(): void
}

class D {
  +Method(): ???
}

A <|-- B
A <|-- C
B <|-- D
C <|-- D

note right of D
  Diamond Problem:
  Which Method() does D inherit?
  B's or C's version?

  C# avoids this with
  single class inheritance
  + multiple interfaces
end note
@enduml
```

### Q4: When should you use inheritance vs interfaces?

| Use Inheritance When | Use Interfaces When |
|---------------------|---------------------|
| True IS-A relationship | Defining capabilities |
| Sharing implementation | Multiple types need same contract |
| Single hierarchy makes sense | Flexibility needed |
| Base class has significant code | Testing/mocking required |

### Q5: What does `sealed` prevent and why use it?

**Answer**: `sealed` prevents inheritance. Use it when:
1. **Security**: Prevent malicious override of security-critical methods
2. **Performance**: JIT can inline methods (slight optimization)
3. **Design intent**: Class wasn't designed for extension
4. **Correctness**: Prevent broken overrides of complex logic

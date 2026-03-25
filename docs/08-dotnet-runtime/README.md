# .NET Runtime

The .NET Runtime is the execution engine that runs .NET applications. Understanding how it works under the hood is essential for writing performant, efficient code and for troubleshooting complex issues. This knowledge separates senior engineers from those who just write code that "works."

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle ".NET Runtime Architecture" as runtime #LightBlue {

  rectangle "Your Application" as app #LightGreen {
    card "C# / F# / VB.NET Code"
  }

  rectangle "Common Language Runtime (CLR)" as clr #LightYellow {
    card "JIT Compiler"
    card "Garbage Collector"
    card "Type System"
    card "Exception Handling"
    card "Security"
    card "Thread Management"
  }

  rectangle "Base Class Library (BCL)" as bcl #LightCoral {
    card "System.Collections"
    card "System.IO"
    card "System.Net"
    card "System.Threading"
  }

  rectangle "Operating System" as os #LightPink {
    card "Windows / Linux / macOS"
  }

  app --> clr : runs on
  clr --> bcl : uses
  clr --> os : interacts with

}

note bottom of runtime
  The CLR provides a managed
  execution environment with
  automatic memory management
end note
@enduml
```

## What is the .NET Runtime?

The .NET Runtime (also called CoreCLR in .NET Core/.NET 5+) is a **virtual execution system** that provides:

1. **Memory Management** - Automatic allocation and garbage collection
2. **Type Safety** - Runtime type checking and verification
3. **Exception Handling** - Structured exception management
4. **Security** - Code access security and verification
5. **JIT Compilation** - Converting IL to native code
6. **Thread Management** - Thread pool and synchronization

## Compilation and Execution Flow

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle "Compilation Flow" {

  rectangle "Source Code" as src #LightGreen {
    card "Program.cs"
    card "MyClass.cs"
  }

  rectangle "C# Compiler (Roslyn)" as compiler #LightYellow {
    card "Syntax Analysis"
    card "Semantic Analysis"
    card "Code Generation"
  }

  rectangle "Assembly (.dll / .exe)" as assembly #LightCoral {
    card "IL Code (MSIL)"
    card "Metadata"
    card "Manifest"
  }

  rectangle "JIT Compiler" as jit #LightBlue {
    card "Method-by-method"
    card "On first call"
  }

  rectangle "Native Code" as native #LightPink {
    card "x64 / ARM64"
    card "CPU Instructions"
  }

  src --> compiler : compile
  compiler --> assembly : produces
  assembly --> jit : at runtime
  jit --> native : generates

}

note bottom
  Two-stage compilation:
  1. C# → IL (compile time)
  2. IL → Native (runtime)
end note
@enduml
```

## Key Components

| Component | Purpose | Document |
|-----------|---------|----------|
| **CLR** | Core runtime engine | [01-CLRArchitecture.md](./01-CLRArchitecture.md) |
| **Memory Manager** | Stack and heap management | [02-MemoryManagement.md](./02-MemoryManagement.md) |
| **Garbage Collector** | Automatic memory reclamation | [03-GarbageCollection.md](./03-GarbageCollection.md) |
| **JIT Compiler** | IL to native compilation | [04-JITCompilation.md](./04-JITCompilation.md) |
| **Assembly Loader** | Loading and resolving assemblies | [05-AssembliesAndLoading.md](./05-AssembliesAndLoading.md) |

## .NET Versions Evolution

```plantuml
@startuml
skinparam monochrome false
skinparam shadowing false

rectangle ".NET Evolution" {

  rectangle ".NET Framework" as framework #LightCoral {
    card "Windows Only"
    card "Full Framework"
    card "4.8 (final)"
  }

  rectangle ".NET Core" as core #LightGreen {
    card "Cross-Platform"
    card "Open Source"
    card "1.0 → 3.1"
  }

  rectangle ".NET 5+" as modern #LightBlue {
    card "Unified Platform"
    card ".NET 5, 6, 7, 8, 9..."
    card "LTS versions"
  }

  framework -right-> core : evolved to
  core -right-> modern : became

}

note bottom of modern
  .NET 6 and .NET 8 are LTS
  (Long Term Support)
end note
@enduml
```

## Files in This Section

| File | Topics Covered |
|------|----------------|
| [01-CLRArchitecture.md](./01-CLRArchitecture.md) | CLR, CTS, CLS, managed execution, type system |
| [02-MemoryManagement.md](./02-MemoryManagement.md) | Stack vs Heap, value types, reference types, boxing |
| [03-GarbageCollection.md](./03-GarbageCollection.md) | GC generations, LOH, GC modes, finalization, IDisposable |
| [04-JITCompilation.md](./04-JITCompilation.md) | JIT compilation, AOT, tiered compilation, ReadyToRun |
| [05-AssembliesAndLoading.md](./05-AssembliesAndLoading.md) | Assemblies, GAC, assembly loading, reflection |

## Why This Matters for Senior Engineers

Understanding the runtime helps you:

1. **Write Performant Code** - Know what allocates, what doesn't, and when GC runs
2. **Debug Complex Issues** - Memory leaks, GC pauses, assembly loading failures
3. **Make Architectural Decisions** - AOT vs JIT, server vs workstation GC
4. **Optimize Applications** - Reduce allocations, manage large objects, tune GC
5. **Answer Interview Questions** - Deep runtime knowledge impresses interviewers

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────────┐
│                    .NET Runtime Quick Reference                     │
├─────────────────────────────────────────────────────────────────────┤
│ CLR: Common Language Runtime - the execution engine                 │
│ IL:  Intermediate Language - platform-independent bytecode          │
│ JIT: Just-In-Time compiler - IL to native at runtime               │
│ GC:  Garbage Collector - automatic memory management               │
│ BCL: Base Class Library - fundamental .NET types                    │
├─────────────────────────────────────────────────────────────────────┤
│ Stack: Fast, automatic cleanup, value types, method locals         │
│ Heap:  Slower, GC managed, reference types, objects                │
├─────────────────────────────────────────────────────────────────────┤
│ Gen 0: Short-lived objects (collected frequently)                   │
│ Gen 1: Medium-lived objects (buffer between Gen 0 and 2)           │
│ Gen 2: Long-lived objects (collected infrequently)                 │
│ LOH:   Large Object Heap (objects ≥ 85KB)                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Common Interview Topics

1. **What is the CLR?** - Managed execution environment
2. **Stack vs Heap?** - Where different types are stored
3. **How does GC work?** - Generational, mark-and-sweep
4. **What is JIT?** - Just-in-time compilation
5. **Value vs Reference types?** - Storage, copying, performance
6. **What is boxing?** - Converting value type to object
7. **Finalization vs Dispose?** - Deterministic vs non-deterministic cleanup

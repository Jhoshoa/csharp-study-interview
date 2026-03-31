---
displayed_sidebar: cansatSidebar
sidebar_position: 0
---

# C# Fundamentals - Senior Level

## Study Order

Read these files in order, as each builds on the previous:

| # | File | Key Concepts |
|---|------|--------------|
| 1 | `01-TypeSystem.md` | CTS, type hierarchy, compile-time vs runtime types |
| 2 | `02-MemoryManagement.md` | Stack, Heap, GC generations, IDisposable |
| 3 | `03-ValueVsReferenceTypes.md` | struct vs class, equality, records |
| 4 | `04-BoxingUnboxing.md` | Hidden allocations, performance impact |
| 5 | `05-Strings.md` | Immutability, interning, StringBuilder, Span |
| 6 | `06-NullableTypes.md` | Nullable<T>, NRT, null analysis |
| 7 | `07-ParameterPassing.md` | ref, out, in, defensive copies |

## PlantUML Diagrams

All files contain PlantUML diagrams. To render them:

### Option 1: VS Code Extension
Install "PlantUML" extension, then use `Alt+D` to preview.

### Option 2: Online
Copy the PlantUML code to [plantuml.com](http://www.plantuml.com/plantuml/uml)

### Option 3: Command Line
```bash
java -jar plantuml.jar filename.md
```

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    TYPE SYSTEM                               │
├─────────────────────────────────────────────────────────────┤
│ Value Types: int, bool, struct, enum                        │
│   → Stored on stack (when local)                            │
│   → Copied by value                                         │
│   → Cannot be null (unless nullable)                        │
│                                                             │
│ Reference Types: class, interface, delegate, array, string  │
│   → Variable holds reference (pointer)                      │
│   → Object data on heap                                     │
│   → Can be null                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    MEMORY                                    │
├─────────────────────────────────────────────────────────────┤
│ Stack: Fast, LIFO, method frames, ~1MB per thread           │
│ Heap:  Managed by GC, reference type instances              │
│                                                             │
│ GC Generations:                                             │
│   Gen 0: New objects (~256KB), collected frequently         │
│   Gen 1: Survived 1 collection, buffer zone                 │
│   Gen 2: Long-lived, collected infrequently                 │
│   LOH:   Objects >85KB, collected with Gen 2                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BOXING                                    │
├─────────────────────────────────────────────────────────────┤
│ Boxing:   value type → object (heap allocation)             │
│ Unboxing: object → value type (requires cast)               │
│                                                             │
│ Hidden Boxing:                                              │
│   - Non-generic collections (ArrayList)                     │
│   - string.Format("{0}", intValue)                         │
│   - Interface variables with struct                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PARAMETERS                                │
├─────────────────────────────────────────────────────────────┤
│ (none): By value - copy passed                              │
│ ref:    By reference - can modify caller's variable         │
│ out:    Output - must assign, no init required              │
│ in:     Readonly reference - for large struct performance   │
└─────────────────────────────────────────────────────────────┘
```

## Key Interview Topics

1. **"What's the difference between value and reference types?"**
   → See: `03-ValueVsReferenceTypes.md`

2. **"Explain the garbage collector"**
   → See: `02-MemoryManagement.md`

3. **"What is boxing?"**
   → See: `04-BoxingUnboxing.md`

4. **"Why are strings immutable?"**
   → See: `05-Strings.md`

5. **"Explain ref, out, and in parameters"**
   → See: `07-ParameterPassing.md`

## Practice Exercises

After reading each file, try these:

1. **Type System**: Write code that demonstrates `typeof()` vs `GetType()`
2. **Memory**: Use `GC.GetTotalMemory()` to measure allocations
3. **Value/Ref**: Create a mutable struct bug, then fix it with readonly
4. **Boxing**: Find 3 places in legacy code where boxing occurs
5. **Strings**: Benchmark `+=` vs `StringBuilder` for 10,000 concatenations
6. **Nullable**: Enable NRT in a project and fix all warnings
7. **Parameters**: Implement `Swap<T>` using ref parameters

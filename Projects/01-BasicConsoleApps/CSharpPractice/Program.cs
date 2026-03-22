// C# Practice Console Application
// Use this project to practice and test C# concepts

Console.WriteLine("=== C# Practice Console ===\n");

// ============================================
// 1. VALUE TYPES VS REFERENCE TYPES
// ============================================
Console.WriteLine("--- Value vs Reference Types ---");

int a = 5;
int b = a;
b = 10;
Console.WriteLine($"Value type: a = {a}, b = {b}"); // a still 5

var list1 = new List<int> { 1, 2, 3 };
var list2 = list1;
list2.Add(4);
Console.WriteLine($"Reference type: list1 count = {list1.Count}"); // 4

// ============================================
// 2. BOXING AND UNBOXING
// ============================================
Console.WriteLine("\n--- Boxing/Unboxing ---");

int num = 42;
object boxed = num;      // Boxing
int unboxed = (int)boxed; // Unboxing
Console.WriteLine($"Boxed: {boxed}, Unboxed: {unboxed}");

// ============================================
// 3. PATTERN MATCHING
// ============================================
Console.WriteLine("\n--- Pattern Matching ---");

object obj = "Hello World";
if (obj is string s)
    Console.WriteLine($"It's a string: {s}");

string GetTypeDescription(object o) => o switch
{
    int i => $"Integer: {i}",
    string str => $"String: {str}",
    null => "Null",
    _ => "Unknown type"
};
Console.WriteLine(GetTypeDescription(42));

// ============================================
// 4. DELEGATES (Func, Action, Predicate)
// ============================================
Console.WriteLine("\n--- Delegates ---");

Func<int, int, int> add = (x, y) => x + y;
Action<string> print = msg => Console.WriteLine(msg);
Predicate<int> isEven = n => n % 2 == 0;

Console.WriteLine($"add(3, 4) = {add(3, 4)}");
print("Hello from Action!");
Console.WriteLine($"isEven(4) = {isEven(4)}");

// ============================================
// 5. LINQ
// ============================================
Console.WriteLine("\n--- LINQ ---");

var numbers = Enumerable.Range(1, 10);
var evenSquares = numbers.Where(n => n % 2 == 0).Select(n => n * n).ToList();
Console.WriteLine($"Even squares: {string.Join(", ", evenSquares)}");

// ============================================
// 6. ASYNC/AWAIT
// ============================================
Console.WriteLine("\n--- Async/Await ---");

async Task<string> GetDataAsync()
{
    await Task.Delay(100);
    return "Data loaded!";
}
var data = await GetDataAsync();
Console.WriteLine(data);

// ============================================
// 7. RECORDS
// ============================================
Console.WriteLine("\n--- Records ---");

var person1 = new Person("John", "Doe");
var person2 = new Person("John", "Doe");
Console.WriteLine($"person1 == person2: {person1 == person2}");

var person3 = person1 with { FirstName = "Jane" };
Console.WriteLine($"Modified record: {person3}");

// ============================================
// 8. GENERICS
// ============================================
Console.WriteLine("\n--- Generics ---");

T Max<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) > 0 ? a : b;
Console.WriteLine($"Max(5, 3) = {Max(5, 3)}");

Console.WriteLine("\n=== Practice Complete ===");

public record Person(string FirstName, string LastName);

import type { Phase } from '../types'
export const phase8: Phase = {
  id: 8,
  title: { en: 'OOP Part 2', pt: 'POO Parte 2' },
  description: { en: 'Inheritance, polymorphism, abstract classes and dataclasses.', pt: 'Herança, polimorfismo, classes abstratas e dataclasses.' },
  icon: '🧬',
  libraries: ['dataclasses', 'abc'],
  lesson: {
    title: { en: 'OOP Part 2 — Inheritance & Polymorphism', pt: 'POO Parte 2 — Herança e Polimorfismo' },
    blocks: [
      { type: 'heading', content: { en: 'Inheritance — reusing code', pt: 'Herança — reutilizando código' } },
      { type: 'text', content: { en: 'Inheritance lets a class <strong>inherit</strong> attributes and methods from a parent class. The child class gets everything from the parent and can add or override things.', pt: 'Herança permite que uma classe <strong>herde</strong> atributos e métodos de uma classe pai. A classe filha obtém tudo do pai e pode adicionar ou sobrescrever coisas.' } },
      { type: 'code', code: `class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound
    
    def speak(self):
        print(f"{self.name} says {self.sound}!")
    
    def __str__(self):
        return f"Animal: {self.name}"

class Dog(Animal):          # Dog inherits from Animal
    def __init__(self, name):
        super().__init__(name, "Woof")  # call parent __init__
        self.tricks = []
    
    def learn_trick(self, trick):
        self.tricks.append(trick)
    
    def show_tricks(self):
        print(f"{self.name} knows: {', '.join(self.tricks)}")

class Cat(Animal):
    def __init__(self, name):
        super().__init__(name, "Meow")
    
    def speak(self):         # override parent method
        print(f"{self.name} says MEOW quietly...")

dog = Dog("Rex")
cat = Cat("Whiskers")
dog.speak()         # Rex says Woof!
cat.speak()         # Whiskers says MEOW quietly...
dog.learn_trick("sit")
dog.show_tricks()` },
      { type: 'heading', content: { en: 'Polymorphism — same interface, different behavior', pt: 'Polimorfismo — mesma interface, comportamento diferente' } },
      { type: 'code', code: `class Shape:
    def area(self):
        raise NotImplementedError("Subclass must implement area()")
    
    def __str__(self):
        return f"{self.__class__.__name__} with area {self.area():.2f}"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2

class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height
    
    def area(self):
        return 0.5 * self.base * self.height

# Polymorphism in action
shapes = [Rectangle(4, 5), Circle(3), Triangle(6, 4)]
for shape in shapes:
    print(shape)   # calls each object's area() differently` },
      { type: 'heading', content: { en: 'Abstract classes with ABC', pt: 'Classes abstratas com ABC' } },
      { type: 'code', code: `from abc import ABC, abstractmethod

class Vehicle(ABC):
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
    
    @abstractmethod
    def fuel_type(self):
        pass   # must be implemented by subclasses
    
    @abstractmethod
    def max_speed(self):
        pass
    
    def info(self):
        print(f"{self.year} {self.make} {self.model}")
        print(f"Fuel: {self.fuel_type()} | Max speed: {self.max_speed()} km/h")

class ElectricCar(Vehicle):
    def fuel_type(self): return "Electric"
    def max_speed(self): return 250

class GasCar(Vehicle):
    def fuel_type(self): return "Gasoline"
    def max_speed(self): return 220

tesla = ElectricCar("Tesla", "Model 3", 2023)
tesla.info()` },
      { type: 'heading', content: { en: 'Dataclasses — less boilerplate', pt: 'Dataclasses — menos código repetitivo' } },
      { type: 'code', code: `from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0
    tags: list = field(default_factory=list)
    
    def total_value(self):
        return self.price * self.quantity
    
    def add_tag(self, tag):
        self.tags.append(tag)

# dataclass auto-generates __init__, __repr__, __eq__
p = Product("Laptop", 999.99, 5)
print(p)
print(p.total_value())
p.add_tag("electronics")
p.add_tag("portable")
print(p.tags)

# Comparison works automatically
p2 = Product("Laptop", 999.99, 5)
print(p == p2)  # True` },
      { type: 'tip', content: { en: 'Use <code>@dataclass</code> when your class is mainly for storing data. It auto-generates <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you — less code to write.', pt: 'Use <code>@dataclass</code> quando sua classe serve principalmente para armazenar dados. Ele gera automaticamente <code>__init__</code>, <code>__repr__</code> e <code>__eq__</code> para você.' } }
    ]
  },
  exercises: [
    {
      id: 'ex8_1',
      title: { en: 'RPG Characters', pt: 'Personagens RPG' },
      description: { en: 'Create a base Character class with name, hp, and attack(). Then create Warrior (bonus damage), Mage (magic damage), Healer (heals instead of attacking).', pt: 'Crie uma classe base Character com nome, hp e attack(). Depois crie Warrior (dano bônus), Mage (dano mágico), Healer (cura ao invés de atacar).' },
      starterCode: `class Character:
    def __init__(self, name, hp, damage):
        self.name = name
        self.hp = hp
        self.damage = damage
    
    def attack(self, target):
        target.hp -= self.damage
        print(f"{self.name} attacks {target.name} for {self.damage} damage!")
    
    def is_alive(self):
        return self.hp > 0
    
    def __str__(self):
        return f"{self.name} (HP: {self.hp})"

class Warrior(Character):
    def __init__(self, name):
        super().__init__(name, hp=150, damage=25)
    
    def shield_bash(self, target):
        target.hp -= 15
        print(f"{self.name} shield bashes {target.name}!")

class Mage(Character):
    def __init__(self, name):
        super().__init__(name, hp=80, damage=40)

class Healer(Character):
    def __init__(self, name):
        super().__init__(name, hp=100, damage=10)
    
    def heal(self, target):
        target.hp += 30
        print(f"{self.name} heals {target.name} for 30 HP!")

w = Warrior("Thor")
m = Mage("Gandalf")
h = Healer("Elrond")

w.attack(m)
h.heal(m)
print(w, m, h)`,
      hints: [{ en: 'super().__init__() calls the parent class constructor', pt: 'super().__init__() chama o construtor da classe pai' }]
    },
    {
      id: 'ex8_2',
      title: { en: 'Shape Calculator', pt: 'Calculadora de Formas' },
      description: { en: 'Create a base Shape class and subclasses Circle, Rectangle, Triangle. Each must implement area() and perimeter(). Print info for all shapes.', pt: 'Crie uma classe base Shape e subclasses Circle, Rectangle, Triangle. Cada uma deve implementar area() e perimeter(). Imprima info de todas as formas.' },
      starterCode: `import math

class Shape:
    def area(self): return 0
    def perimeter(self): return 0
    def info(self):
        print(f"{self.__class__.__name__}: area={self.area():.2f}, perimeter={self.perimeter():.2f}")

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    def area(self): return math.pi * self.radius ** 2
    def perimeter(self): return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def area(self): return self.w * self.h
    def perimeter(self): return 2 * (self.w + self.h)

class Triangle(Shape):
    def __init__(self, a, b, c):
        self.a, self.b, self.c = a, b, c
    def perimeter(self): return self.a + self.b + self.c
    def area(self):
        s = self.perimeter() / 2
        return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 4, 5)]
for s in shapes:
    s.info()`,
      hints: [{ en: 'Triangle area uses Heron\'s formula: s = perimeter/2, area = sqrt(s*(s-a)*(s-b)*(s-c))', pt: 'Área do triângulo usa fórmula de Heron: s = perímetro/2, area = sqrt(s*(s-a)*(s-b)*(s-c))' }]
    },
    {
      id: 'ex8_3',
      title: { en: 'Product Catalog', pt: 'Catálogo de Produtos' },
      description: { en: 'Use @dataclass to create Product. Create a catalog list and implement search by name, filter by max price, and sort by price.', pt: 'Use @dataclass para criar Product. Crie uma lista de catálogo e implemente busca por nome, filtro por preço máximo e ordenação por preço.' },
      starterCode: `from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    category: str
    in_stock: bool = True

catalog = [
    Product("Laptop", 999.99, "Electronics"),
    Product("Book", 29.99, "Education"),
    Product("Phone", 699.99, "Electronics"),
    Product("Headphones", 149.99, "Electronics"),
    Product("Notebook", 4.99, "Education"),
]

def search(products, query):
    return [p for p in products if query.lower() in p.name.lower()]

def filter_by_max_price(products, max_price):
    return [p for p in products if p.price <= max_price]

def sort_by_price(products):
    return sorted(products, key=lambda p: p.price)

print("Search 'book':", [p.name for p in search(catalog, "book")])
print("Under $200:", [p.name for p in filter_by_max_price(catalog, 200)])
print("By price:", [f"{p.name}(${p.price})" for p in sort_by_price(catalog)])`,
      hints: [{ en: 'sorted() with key=lambda p: p.price sorts by price', pt: 'sorted() com key=lambda p: p.price ordena por preço' }]
    }
  ],

  quiz: [
    { id: 'q8_1', question: { en: 'What does super() do?', pt: 'O que super() faz?' }, options: [{ en: 'Creates a superpower', pt: 'Cria um superpoder' }, { en: 'Calls a method from the parent class', pt: 'Chama um método da classe pai' }, { en: 'Deletes the parent class', pt: 'Deleta a classe pai' }, { en: 'Makes a class private', pt: 'Torna uma classe privada' }], correctIndex: 1, explanation: { en: 'super() gives access to the parent class. super().__init__() calls the parent\'s constructor.', pt: 'super() dá acesso à classe pai. super().__init__() chama o construtor do pai.' } },
    { id: 'q8_2', question: { en: 'What is polymorphism in OOP?', pt: 'O que é polimorfismo em POO?' }, options: [{ en: 'Creating multiple classes', pt: 'Criar múltiplas classes' }, { en: 'Same method name working differently in different classes', pt: 'Mesmo nome de método funcionando diferente em classes diferentes' }, { en: 'Copying a class', pt: 'Copiar uma classe' }, { en: 'Hiding class attributes', pt: 'Esconder atributos da classe' }], correctIndex: 1, explanation: { en: 'Polymorphism means "many forms" — the same method name (like area()) behaves differently based on the object\'s class.', pt: 'Polimorfismo significa "muitas formas" — o mesmo nome de método (como area()) se comporta diferente baseado na classe do objeto.' } },
    { id: 'q8_3', question: { en: 'What does @abstractmethod do?', pt: 'O que @abstractmethod faz?' }, options: [{ en: 'Hides a method', pt: 'Esconde um método' }, { en: 'Forces subclasses to implement the method', pt: 'Força subclasses a implementarem o método' }, { en: 'Makes a method run faster', pt: 'Faz um método rodar mais rápido' }, { en: 'Creates a copy of the method', pt: 'Cria uma cópia do método' }], correctIndex: 1, explanation: { en: '@abstractmethod marks a method that MUST be implemented by any subclass. You can\'t create an instance of a class with unimplemented abstract methods.', pt: '@abstractmethod marca um método que DEVE ser implementado por qualquer subclasse. Você não pode criar uma instância de uma classe com métodos abstratos não implementados.' } },
    { id: 'q8_4', question: { en: 'What does @dataclass automatically generate?', pt: 'O que @dataclass gera automaticamente?' }, options: [{ en: 'Only __init__', pt: 'Apenas __init__' }, { en: '__init__, __repr__, and __eq__', pt: '__init__, __repr__ e __eq__' }, { en: 'All methods', pt: 'Todos os métodos' }, { en: 'Nothing — it\'s decorative', pt: 'Nada — é decorativo' }], correctIndex: 1, explanation: { en: '@dataclass automatically generates __init__ (constructor), __repr__ (string representation), and __eq__ (equality comparison) based on the class fields.', pt: '@dataclass gera automaticamente __init__ (construtor), __repr__ (representação em string) e __eq__ (comparação de igualdade) com base nos campos da classe.' } },
    { id: 'q8_5', question: { en: 'If Dog inherits from Animal, which is the parent?', pt: 'Se Dog herda de Animal, qual é o pai?' }, options: [{ en: 'Dog', pt: 'Dog' }, { en: 'Animal', pt: 'Animal' }, { en: 'Both are parents', pt: 'Ambos são pais' }, { en: 'Neither', pt: 'Nenhum' }], correctIndex: 1, explanation: { en: 'Animal is the parent (base) class. Dog is the child (derived/subclass). class Dog(Animal) — Dog inherits from Animal.', pt: 'Animal é a classe pai (base). Dog é a filha (derivada/subclasse). class Dog(Animal) — Dog herda de Animal.' } }
  ],

  exam: {
    title: { en: 'RPG Character System', pt: 'Sistema de Personagens RPG' },
    scenario: {
      en: `Build an RPG Character System using inheritance.

Create:
1. Base class Character(name, hp, damage) with attack(target) and is_alive() methods
2. Warrior class (hp=150, damage=25) with shield_bash(target) dealing 15 damage
3. Mage class (hp=80, damage=40) with fireball(target) dealing 60 damage
4. Healer class (hp=100, damage=10) with heal(target) restoring 30 hp

Demo:
- Create one of each character
- Have warrior attack mage
- Have healer heal mage
- Have mage fireball warrior
- Print all characters at the end`,
      pt: `Construa um Sistema de Personagens RPG usando herança.`
    },
    requirements: { en: ['Create base Character class', 'Warrior with shield_bash()', 'Mage with fireball()', 'Healer with heal()', 'Use super().__init__()', 'Program runs without errors'], pt: ['Crie classe base Character', 'Warrior com shield_bash()', 'Mage com fireball()', 'Healer com heal()', 'Use super().__init__()', 'Programa roda sem erros'] },
    starterCode: `class Character:
    def __init__(self, name, hp, damage):
        self.name = name
        self.hp = hp
        self.damage = damage
    def attack(self, target):
        target.hp -= self.damage
        print(f"{self.name} attacks {target.name} for {self.damage}!")
    def is_alive(self):
        return self.hp > 0
    def __str__(self):
        return f"{self.name} HP:{self.hp}"

class Warrior(Character):
    def __init__(self, name):
        super().__init__(name, 150, 25)
    def shield_bash(self, target):
        target.hp -= 15
        print(f"{self.name} shield bashes {target.name}!")

class Mage(Character):
    def __init__(self, name):
        super().__init__(name, 80, 40)
    def fireball(self, target):
        target.hp -= 60
        print(f"{self.name} fireballs {target.name} for 60!")

class Healer(Character):
    def __init__(self, name):
        super().__init__(name, 100, 10)
    def heal(self, target):
        target.hp += 30
        print(f"{self.name} heals {target.name} for 30!")

w = Warrior("Thor")
m = Mage("Gandalf")
h = Healer("Elrond")
w.attack(m)
h.heal(m)
m.fireball(w)
print(w, m, h)
`,
    testCases: [
      { id: 'tc8_1', description: { en: 'Warrior attacks', pt: 'Warrior ataca' }, inputs: [], checks: [{ type: 'contains_any', value: ['attack', 'attacks', 'Attack'] }], points: 10 },
      { id: 'tc8_2', description: { en: 'Healer heals', pt: 'Healer cura' }, inputs: [], checks: [{ type: 'contains_any', value: ['heal', 'heals', 'Heal'] }], points: 10 },
      { id: 'tc8_3', description: { en: 'Mage fireballs', pt: 'Mage lança fireball' }, inputs: [], checks: [{ type: 'contains_any', value: ['fireball', 'Fireball', '60'] }], points: 10 },
      { id: 'tc8_4', description: { en: 'Thor appears in output', pt: 'Thor aparece na saída' }, inputs: [], checks: [{ type: 'contains', value: 'Thor' }], points: 10 },
      { id: 'tc8_5', description: { en: 'Gandalf appears in output', pt: 'Gandalf aparece na saída' }, inputs: [], checks: [{ type: 'contains', value: 'Gandalf' }], points: 10 },
      { id: 'tc8_6', description: { en: 'Elrond appears in output', pt: 'Elrond aparece na saída' }, inputs: [], checks: [{ type: 'contains', value: 'Elrond' }], points: 10 },
      { id: 'tc8_7', description: { en: 'HP values shown', pt: 'Valores de HP mostrados' }, inputs: [], checks: [{ type: 'contains', value: 'HP' }], points: 10 },
      { id: 'tc8_8', description: { en: 'shield_bash used', pt: 'shield_bash usado' }, inputs: [], checks: [{ type: 'contains_any', value: ['bash', 'Bash', 'shield', '15'] }], points: 10 },
      { id: 'tc8_9', description: { en: 'Runs without errors', pt: 'Roda sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 },
      { id: 'tc8_10', description: { en: 'All three characters shown', pt: 'Todos os três personagens mostrados' }, inputs: [], checks: [{ type: 'contains', value: 'Thor' }, { type: 'contains', value: 'Gandalf' }], points: 10 }
    ]
  }
}

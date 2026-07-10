import type { Phase } from '../types'

export const phase7: Phase = {
  id: 7,
  title: { en: 'OOP Part 1', pt: 'POO Parte 1' },
  description: {
    en: 'Learn Object-Oriented Programming — classes, objects, methods and attributes.',
    pt: 'Aprenda Programação Orientada a Objetos — classes, objetos, métodos e atributos.'
  },
  icon: '🏗️',
  libraries: [],

  lesson: {
    title: { en: 'Object-Oriented Programming — Part 1', pt: 'Programação Orientada a Objetos — Parte 1' },
    blocks: [
      { type: 'heading', content: { en: 'What is OOP?', pt: 'O que é POO?' } },
      {
        type: 'text',
        content: {
          en: 'Object-Oriented Programming is a way to organize code around <strong>objects</strong> — things that have both data (attributes) and behavior (methods). Think of a class as a blueprint and an object as a house built from that blueprint. You can build many houses from one blueprint.',
          pt: 'Programação Orientada a Objetos é uma forma de organizar código em torno de <strong>objetos</strong> — coisas que têm dados (atributos) e comportamento (métodos). Pense em uma classe como uma planta baixa e um objeto como uma casa construída a partir dela. Você pode construir muitas casas com uma planta baixa.'
        }
      },
      { type: 'video', videoUrl: 'https://www.youtube.com/watch?v=JeznW_7DlB0', videoTitle: { en: 'Python OOP explained', pt: 'POO em Python explicada' }, videoDuration: '1:00' },
      { type: 'heading', content: { en: 'Creating your first class', pt: 'Criando sua primeira classe' } },
      {
        type: 'code',
        code: `class Dog:
    # __init__ is the constructor — runs when you create an object
    def __init__(self, name, breed, age):
        self.name = name      # attribute
        self.breed = breed
        self.age = age
    
    # Methods — functions that belong to the class
    def bark(self):
        print(f"{self.name} says: Woof!")
    
    def info(self):
        print(f"{self.name} is a {self.age}-year-old {self.breed}")

# Create objects (instances)
rex = Dog("Rex", "German Shepherd", 3)
buddy = Dog("Buddy", "Golden Retriever", 5)

rex.bark()       # Rex says: Woof!
buddy.info()     # Buddy is a 5-year-old Golden Retriever
print(rex.name)  # Rex`
      },
      {
        type: 'tip',
        content: {
          en: '<code>self</code> refers to the current object. Every method must have <code>self</code> as the first parameter. When you call <code>rex.bark()</code>, Python automatically passes <code>rex</code> as self.',
          pt: '<code>self</code> refere-se ao objeto atual. Todo método deve ter <code>self</code> como primeiro parâmetro. Quando você chama <code>rex.bark()</code>, Python passa automaticamente <code>rex</code> como self.'
        }
      },
      { type: 'heading', content: { en: 'Instance vs class attributes', pt: 'Atributos de instância vs classe' } },
      {
        type: 'code',
        code: `class BankAccount:
    interest_rate = 0.05    # class attribute — shared by ALL accounts
    
    def __init__(self, owner, balance=0):
        self.owner = owner           # instance attribute — unique per object
        self.balance = balance
        self.transactions = []
    
    def deposit(self, amount):
        self.balance += amount
        self.transactions.append(f"+\${amount}")
        print(f"Deposited \${amount}. Balance: \${self.balance}")
    
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds!")
            return
        self.balance -= amount
        self.transactions.append(f"-\${amount}")
    
    def get_history(self):
        return self.transactions

account = BankAccount("Alex", 1000)
account.deposit(500)
account.withdraw(200)
print(BankAccount.interest_rate)  # 0.05`
      },
      { type: 'heading', content: { en: '@property — smart attributes', pt: '@property — atributos inteligentes' } },
      {
        type: 'code',
        code: `class Circle:
    def __init__(self, radius):
        self._radius = radius   # _ means "private by convention"
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
    
    @property
    def area(self):           # computed property — no setter needed
        import math
        return math.pi * self._radius ** 2
    
    @property
    def diameter(self):
        return self._radius * 2

c = Circle(5)
print(c.area)      # 78.54...
print(c.diameter)  # 10
c.radius = 10      # uses setter
# c.radius = -1    # raises ValueError`
      },
      { type: 'heading', content: { en: 'Special methods (dunders)', pt: 'Métodos especiais (dunders)' } },
      {
        type: 'code',
        code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):          # print(point) → "Point(3, 4)"
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):         # developer representation
        return f"Point(x={self.x}, y={self.y})"
    
    def __eq__(self, other):    # point1 == point2
        return self.x == other.x and self.y == other.y
    
    def __add__(self, other):   # point1 + point2
        return Point(self.x + other.x, self.y + other.y)

p1 = Point(1, 2)
p2 = Point(3, 4)
print(p1)           # Point(1, 2)
print(p1 + p2)      # Point(4, 6)
print(p1 == p2)     # False`
      }
    ]
  },

  exercises: [
    {
      id: 'ex7_1',
      title: { en: 'Student Class', pt: 'Classe Aluno' },
      description: {
        en: 'Create a Student class with name, grades list, and methods to add grades, get average, and get letter grade.',
        pt: 'Crie uma classe Student com nome, lista de notas e métodos para adicionar notas, obter média e obter conceito.'
      },
      starterCode: `class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []
    
    def add_grade(self, grade):
        self.grades.append(grade)
    
    def average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)
    
    def letter_grade(self):
        avg = self.average()
        if avg >= 90: return "A"
        elif avg >= 80: return "B"
        elif avg >= 70: return "C"
        else: return "F"
    
    def __str__(self):
        return f"{self.name} — avg: {self.average():.1f} ({self.letter_grade()})"

# Test
s = Student("Alice")
s.add_grade(92)
s.add_grade(88)
s.add_grade(95)
print(s)`,
      hints: [{ en: 'self.grades is a list — use append() to add grades', pt: 'self.grades é uma lista — use append() para adicionar notas' }]
    },
    {
      id: 'ex7_2',
      title: { en: 'Shopping Cart Class', pt: 'Classe Carrinho de Compras' },
      description: {
        en: 'Create a ShoppingCart class with items dict, methods to add/remove items, and calculate total.',
        pt: 'Crie uma classe ShoppingCart com dicionário de itens, métodos para adicionar/remover itens e calcular total.'
      },
      starterCode: `class ShoppingCart:
    def __init__(self):
        self.items = {}   # {name: price}
    
    def add_item(self, name, price):
        self.items[name] = price
        print(f"Added {name} (\${price:.2f})")
    
    def remove_item(self, name):
        if name in self.items:
            del self.items[name]
            print(f"Removed {name}")
        else:
            print(f"{name} not in cart")
    
    def total(self):
        return sum(self.items.values())
    
    def receipt(self):
        print("=== Receipt ===")
        for item, price in self.items.items():
            print(f"{item}: \${price:.2f}")
        print(f"Total: \${self.total():.2f}")

cart = ShoppingCart()
cart.add_item("Pizza", 12.99)
cart.add_item("Burger", 9.99)
cart.add_item("Salad", 7.99)
cart.remove_item("Burger")
cart.receipt()`,
      hints: [{ en: 'Use self.items.values() to get all prices', pt: 'Use self.items.values() para obter todos os preços' }]
    },
    {
      id: 'ex7_3',
      title: { en: 'Temperature Class', pt: 'Classe Temperatura' },
      description: {
        en: 'Create a Temperature class that stores value in Celsius. Use @property to provide fahrenheit and kelvin conversions.',
        pt: 'Crie uma classe Temperature que armazena o valor em Celsius. Use @property para fornecer conversões para Fahrenheit e Kelvin.'
      },
      starterCode: `class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32
    
    @property
    def kelvin(self):
        return self._celsius + 273.15
    
    def __str__(self):
        return f"{self._celsius}°C = {self.fahrenheit:.1f}°F = {self.kelvin:.2f}K"

t = Temperature(100)
print(t)
t.celsius = 0
print(t)
t.celsius = -40
print(t)`,
      hints: [{ en: 'Fahrenheit = (celsius * 9/5) + 32', pt: 'Fahrenheit = (celsius * 9/5) + 32' }]
    }
  ],

  quiz: [
    {
      id: 'q7_1',
      question: { en: 'What is __init__ in a Python class?', pt: 'O que é __init__ em uma classe Python?' },
      options: [
        { en: 'A method to delete objects', pt: 'Um método para deletar objetos' },
        { en: 'The constructor — runs automatically when an object is created', pt: 'O construtor — executa automaticamente quando um objeto é criado' },
        { en: 'A special variable', pt: 'Uma variável especial' },
        { en: 'A way to import modules', pt: 'Uma forma de importar módulos' }
      ],
      correctIndex: 1,
      explanation: { en: '__init__ is called automatically when you create an instance (object) of a class. It sets up the initial state of the object.', pt: '__init__ é chamado automaticamente quando você cria uma instância (objeto) de uma classe. Ele configura o estado inicial do objeto.' }
    },
    {
      id: 'q7_2',
      question: { en: 'What does "self" represent in a method?', pt: 'O que "self" representa em um método?' },
      options: [
        { en: 'The class itself', pt: 'A própria classe' },
        { en: 'The current instance (object) calling the method', pt: 'A instância (objeto) atual que chama o método' },
        { en: 'A required variable name', pt: 'Um nome de variável obrigatório' },
        { en: 'The parent class', pt: 'A classe pai' }
      ],
      correctIndex: 1,
      explanation: { en: 'self is a reference to the current instance. It allows methods to access and modify the object\'s attributes. You can name it anything but "self" is the convention.', pt: 'self é uma referência à instância atual. Permite que métodos acessem e modifiquem os atributos do objeto. Pode ser nomeado de qualquer coisa, mas "self" é a convenção.' }
    },
    {
      id: 'q7_3',
      question: { en: 'What is the difference between a class and an object?', pt: 'Qual é a diferença entre uma classe e um objeto?' },
      options: [
        { en: 'They are the same thing', pt: 'São a mesma coisa' },
        { en: 'A class is the blueprint; an object is an instance created from it', pt: 'Uma classe é a planta baixa; um objeto é uma instância criada a partir dela' },
        { en: 'An object is the blueprint; a class is an instance', pt: 'Um objeto é a planta baixa; uma classe é uma instância' },
        { en: 'Classes store data; objects store methods', pt: 'Classes armazenam dados; objetos armazenam métodos' }
      ],
      correctIndex: 1,
      explanation: { en: 'The class defines the structure and behavior (blueprint). Objects are actual instances — you can create many objects from one class, each with their own data.', pt: 'A classe define a estrutura e o comportamento (planta baixa). Objetos são instâncias reais — você pode criar muitos objetos de uma classe, cada um com seus próprios dados.' }
    },
    {
      id: 'q7_4',
      question: { en: 'What does __str__ do?', pt: 'O que __str__ faz?' },
      options: [
        { en: 'Converts a string to an object', pt: 'Converte uma string em um objeto' },
        { en: 'Defines what print(object) displays', pt: 'Define o que print(objeto) exibe' },
        { en: 'Creates a new string attribute', pt: 'Cria um novo atributo string' },
        { en: 'Compares two objects', pt: 'Compara dois objetos' }
      ],
      correctIndex: 1,
      explanation: { en: '__str__ defines the human-readable string representation of an object, used when you call print() or str() on it.', pt: '__str__ define a representação em string legível por humanos de um objeto, usada quando você chama print() ou str() nele.' }
    },
    {
      id: 'q7_5',
      question: { en: 'What does @property do?', pt: 'O que @property faz?' },
      options: [
        { en: 'Creates a class attribute', pt: 'Cria um atributo de classe' },
        { en: 'Makes a method accessible like an attribute (without parentheses)', pt: 'Torna um método acessível como atributo (sem parênteses)' },
        { en: 'Makes an attribute private', pt: 'Torna um atributo privado' },
        { en: 'Copies a property from another class', pt: 'Copia uma propriedade de outra classe' }
      ],
      correctIndex: 1,
      explanation: { en: '@property lets you call a method without parentheses, making computed values look like attributes. obj.area instead of obj.area().', pt: '@property permite chamar um método sem parênteses, tornando valores computados parecidos com atributos. obj.area em vez de obj.area().' }
    }
  ],

  exam: {
    title: { en: 'Bank Account System', pt: 'Sistema de Conta Bancária' },
    scenario: {
      en: `Build a Bank Account system using a class.

Create a BankAccount class with:
- owner (name) and balance attributes
- deposit(amount) method — adds money, prints confirmation
- withdraw(amount) method — removes money if sufficient funds, else prints error
- get_balance() method — returns current balance
- __str__ method — returns "Owner: [name] | Balance: $[balance]"

Test your class:
1. Create account for "Alex" with $1000 starting balance
2. Deposit $500
3. Withdraw $200
4. Try to withdraw $5000 (should fail)
5. Print the account

Expected output includes:
Deposited $500
Withdrew $200
Insufficient funds
Alex`,
      pt: `Construa um sistema de Conta Bancária usando uma classe.

Crie uma classe BankAccount com atributos owner e balance, métodos deposit, withdraw, get_balance e __str__.`
    },
    requirements: {
      en: ['Create BankAccount class with __init__', 'deposit() method adds money', 'withdraw() checks for sufficient funds', 'get_balance() returns balance', '__str__ includes owner name and balance', 'Program runs without errors'],
      pt: ['Crie classe BankAccount com __init__', 'Método deposit() adiciona dinheiro', 'withdraw() verifica fundos suficientes', 'get_balance() retorna saldo', '__str__ inclui nome e saldo', 'Programa roda sem erros']
    },
    starterCode: `# Phase 7 Exam — Bank Account

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
    
    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited \${amount}")
    
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
            return
        self.balance -= amount
        print(f"Withdrew \${amount}")
    
    def get_balance(self):
        return self.balance
    
    def __str__(self):
        return f"Owner: {self.owner} | Balance: \${self.balance}"

# Test your class
account = BankAccount("Alex", 1000)
account.deposit(500)
account.withdraw(200)
account.withdraw(5000)
print(account)
`,
    testCases: [
      { id: 'tc7_1', description: { en: 'Deposit confirmation printed', pt: 'Confirmação de depósito impressa' }, inputs: [], checks: [{ type: 'contains_any', value: ['Deposited', 'deposited', 'deposit'] }], points: 10 },
      { id: 'tc7_2', description: { en: 'Withdraw confirmation printed', pt: 'Confirmação de saque impressa' }, inputs: [], checks: [{ type: 'contains_any', value: ['Withdrew', 'withdrew', 'withdraw'] }], points: 10 },
      { id: 'tc7_3', description: { en: 'Insufficient funds message shown', pt: 'Mensagem de fundos insuficientes mostrada' }, inputs: [], checks: [{ type: 'contains_any', value: ['Insufficient', 'insufficient', 'funds', 'enough'] }], points: 10 },
      { id: 'tc7_4', description: { en: 'Output contains owner label', pt: 'Saída contém rótulo de dono' }, inputs: [], checks: [{ type: 'contains_any', value: ['Owner', 'owner', 'Alex', 'Name'] }], points: 10 },
      { id: 'tc7_5', description: { en: 'Balance shown in output', pt: 'Saldo mostrado na saída' }, inputs: [], checks: [{ type: 'contains', value: '1300' }], points: 10 },
      { id: 'tc7_6', description: { en: 'Deposit amount $500 mentioned', pt: 'Valor do depósito $500 mencionado' }, inputs: [], checks: [{ type: 'contains', value: '500' }], points: 10 },
      { id: 'tc7_7', description: { en: 'Withdraw amount $200 mentioned', pt: 'Valor do saque $200 mencionado' }, inputs: [], checks: [{ type: 'contains', value: '200' }], points: 10 },
      { id: 'tc7_8', description: { en: 'Balance is 1300 after operations', pt: 'Saldo é 1300 após operações' }, inputs: [], checks: [{ type: 'contains', value: '1300' }], points: 10 },
      { id: 'tc7_9', description: { en: 'Runs without errors', pt: 'Roda sem erros' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 10 },
      { id: 'tc7_10', description: { en: 'Balance shows correct value after operations', pt: 'Saldo mostra valor correto após operações' }, inputs: [], checks: [{ type: 'contains', value: '1300' }], points: 10 }
    ]
  }
}

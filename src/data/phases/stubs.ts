import type { Phase } from '../types'

const stub = (id: number, title: { en: string; pt: string }, description: { en: string; pt: string }, icon: string, libraries: string[] = [], lessonBlocks?: any[]): Phase => ({
  id,
  title,
  description,
  icon,
  libraries,
  lesson: {
    title,
    blocks: lessonBlocks || [
      { type: 'heading', content: title },
      { type: 'text', content: { en: `This phase covers: ${title.en}. Content is being prepared — complete the previous phases first to unlock this one!`, pt: `Esta fase cobre: ${title.pt}. O conteúdo está sendo preparado — complete as fases anteriores primeiro para desbloquear esta!` } }
    ]
  },
  exercises: [],
  quiz: [],
  exam: {
    title: { en: `Phase \${id} Exam`, pt: `Exame Fase ${id}` },
    scenario: { en: 'Complete the previous phases to unlock this exam.', pt: 'Complete as fases anteriores para desbloquear este exame.' },
    requirements: { en: [], pt: [] },
    starterCode: `# Phase ${id} exam — coming soon!
print("Coming soon")
`,
    testCases: [{ id: `tc\${id}_1`, description: { en: 'Program runs', pt: 'Programa roda' }, inputs: [], checks: [{ type: 'no_error', value: '' }], points: 100 }]
  }
})

export const phase9 = stub(9,
  { en: 'Errors, Logging & Debugging', pt: 'Erros, Logging e Debugging' },
  { en: 'Handle errors gracefully, log events, and debug like a professional.', pt: 'Trate erros elegantemente, registre eventos e depure como um profissional.' },
  '🐛', ['logging'],
  [
    { type: 'heading', content: { en: 'try / except / finally', pt: 'try / except / finally' } },
    { type: 'text', content: { en: 'Error handling lets your program deal with problems gracefully instead of crashing. Use <code>try</code> to run risky code, <code>except</code> to handle errors, <code>finally</code> to always run cleanup code.', pt: 'Tratamento de erros permite que seu programa lide com problemas elegantemente em vez de travar. Use <code>try</code> para código arriscado, <code>except</code> para tratar erros, <code>finally</code> para código de limpeza que sempre roda.' } },
    { type: 'code', code: `try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"Result: {result}")
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Can't divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("This always runs")` },
    { type: 'heading', content: { en: 'Custom exceptions', pt: 'Exceções personalizadas' } },
    { type: 'code', code: `class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        self.amount = amount
        self.balance = balance
        super().__init__(f"Cannot withdraw \${amount}. Balance: \${balance}")

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(amount, balance)
    return balance - amount

try:
    new_balance = withdraw(100, 500)
except InsufficientFundsError as e:
    print(e)` },
    { type: 'heading', content: { en: 'Logging — better than print', pt: 'Logging — melhor que print' } },
    { type: 'code', code: `import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log'
)

logging.debug("Debug message — only for development")
logging.info("App started successfully")
logging.warning("Low disk space")
logging.error("Failed to connect to database")
logging.critical("System is shutting down!")` },
    { type: 'video', videoUrl: 'https://www.youtube.com/watch?v=g8nQ90Hk328', videoTitle: { en: 'Python error handling', pt: 'Tratamento de erros Python' }, videoDuration: '0:58' }
  ]
)

export const phase10 = stub(10,
  { en: 'Modules, Packages & Environments', pt: 'Módulos, Pacotes e Ambientes' },
  { en: 'Organize code into modules, manage packages with pip, and use virtual environments.', pt: 'Organize código em módulos, gerencie pacotes com pip e use ambientes virtuais.' },
  '📦', ['venv', 'pip'],
  [
    { type: 'heading', content: { en: 'Importing modules', pt: 'Importando módulos' } },
    { type: 'code', code: `# Import entire module
import math
print(math.pi)
print(math.sqrt(16))

# Import specific functions
from math import sqrt, pi, floor
print(sqrt(16))

# Import with alias
import datetime as dt
today = dt.date.today()
print(today)

# Import your own module (mymodule.py)
# import mymodule
# from mymodule import my_function` },
    { type: 'heading', content: { en: 'Creating your own modules', pt: 'Criando seus próprios módulos' } },
    { type: 'code', code: `# utils.py — your own module
def greet(name):
    return f"Hello, {name}!"

def calculate_tax(amount, rate=0.13):
    return amount * rate

PI = 3.14159

# main.py — using your module
# from utils import greet, calculate_tax
# print(greet("Alex"))
# print(calculate_tax(100))` },
    { type: 'heading', content: { en: 'Virtual environments', pt: 'Ambientes virtuais' } },
    { type: 'code', code: `# Create virtual environment
# python -m venv venv

# Activate (Windows)
# venv\\Scripts\\activate

# Activate (Mac/Linux)
# source venv/bin/activate

# Install packages
# pip install requests pandas

# Save requirements
# pip freeze > requirements.txt

# Install from requirements
# pip install -r requirements.txt

# Deactivate
# deactivate` },
    { type: 'tip', content: { en: 'Always create a virtual environment for each project. This keeps dependencies isolated and avoids version conflicts between projects.', pt: 'Sempre crie um ambiente virtual para cada projeto. Isso mantém as dependências isoladas e evita conflitos de versão entre projetos.' } }
  ]
)

export const phase11 = stub(11,
  { en: 'Advanced Python Patterns', pt: 'Padrões Avançados de Python' },
  { en: 'Generators, decorators, lambda, context managers and functional programming.', pt: 'Generators, decorators, lambda, context managers e programação funcional.' },
  '⚡', ['functools', 'itertools'],
  [
    { type: 'heading', content: { en: 'Generators', pt: 'Generators' } },
    { type: 'text', content: { en: 'A generator is a function that yields values one at a time instead of returning them all at once. Perfect for processing large datasets without loading everything into memory.', pt: 'Um generator é uma função que produz valores um de cada vez em vez de retorná-los todos de uma vez. Perfeito para processar grandes conjuntos de dados sem carregar tudo na memória.' } },
    { type: 'code', code: `# Generator function
def count_up(start, end):
    current = start
    while current <= end:
        yield current
        current += 1

for num in count_up(1, 5):
    print(num)  # 1 2 3 4 5

# Generator expression
squares = (x**2 for x in range(10))
print(list(squares))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]` },
    { type: 'heading', content: { en: 'Decorators', pt: 'Decorators' } },
    { type: 'code', code: `import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(0.1)
    return "done"

slow_function()  # slow_function took 0.1002s` },
    { type: 'heading', content: { en: 'Lambda, map, filter', pt: 'Lambda, map, filter' } },
    { type: 'code', code: `# Lambda — anonymous function
double = lambda x: x * 2
print(double(5))  # 10

# map — apply function to each item
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
print(doubled)  # [2, 4, 6, 8, 10]

# filter — keep items that match condition
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4]

# sorted with key
people = [("Alice", 30), ("Bob", 25), ("Carol", 35)]
by_age = sorted(people, key=lambda p: p[1])
print(by_age)` }
  ]
)

export const phase12 = stub(12,
  { en: 'APIs & HTTP', pt: 'APIs e HTTP' },
  { en: 'Fetch real data from the internet using the requests library and work with JSON.', pt: 'Busque dados reais da internet usando a biblioteca requests e trabalhe com JSON.' },
  '🌐', ['requests', 'python-dotenv'],
  [
    { type: 'heading', content: { en: 'What is an API?', pt: 'O que é uma API?' } },
    { type: 'text', content: { en: 'An API (Application Programming Interface) is a way for programs to talk to each other. When you use weather apps, maps, or news feeds, they\'re all using APIs to get data from servers.', pt: 'Uma API é uma forma de programas se comunicarem. Quando você usa apps de clima, mapas ou feeds de notícias, todos usam APIs para obter dados de servidores.' } },
    { type: 'code', code: `import requests

# Make a GET request
response = requests.get("https://api.github.com/users/python")
print(response.status_code)  # 200 = success

# Parse JSON response
data = response.json()
print(data["name"])
print(data["public_repos"])

# With parameters
params = {"q": "python", "sort": "stars"}
r = requests.get("https://api.github.com/search/repositories", params=params)
results = r.json()
for repo in results["items"][:3]:
    print(repo["full_name"], "⭐", repo["stargazers_count"])` },
    { type: 'heading', content: { en: 'Environment variables for API keys', pt: 'Variáveis de ambiente para chaves de API' } },
    { type: 'code', code: `# .env file (never commit this!)
# WEATHER_API_KEY=your_key_here

from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("WEATHER_API_KEY")

# Use the key in requests
url = f"https://api.openweathermap.org/data/2.5/weather"
params = {"q": "Toronto", "appid": api_key, "units": "metric"}
r = requests.get(url, params=params)
weather = r.json()
print(f"Temperature: {weather['main']['temp']}°C")` },
    { type: 'warning', content: { en: 'Never hardcode API keys in your code. Always use environment variables. If you commit API keys to GitHub, rotate them immediately.', pt: 'Nunca coloque chaves de API diretamente no código. Sempre use variáveis de ambiente. Se você fizer commit de chaves no GitHub, troque-as imediatamente.' } }
  ]
)

export const phase13 = stub(13,
  { en: 'Testing with pytest', pt: 'Testes com pytest' },
  { en: 'Write professional tests, use fixtures, mock dependencies, and measure code coverage.', pt: 'Escreva testes profissionais, use fixtures, mock dependências e meça cobertura de código.' },
  '🧪', ['pytest', 'pytest-mock', 'coverage'],
  [
    { type: 'heading', content: { en: 'Why test your code?', pt: 'Por que testar seu código?' } },
    { type: 'text', content: { en: 'Tests catch bugs before users do. They let you change code confidently (if tests pass, nothing broke). Professional developers write tests for every important function — it\'s not optional.', pt: 'Testes encontram bugs antes dos usuários. Eles permitem mudar código com confiança (se os testes passam, nada quebrou). Desenvolvedores profissionais escrevem testes para toda função importante.' } },
    { type: 'code', code: `# calculator.py
def add(a, b): return a + b
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# test_calculator.py
import pytest
from calculator import add, divide

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_divide():
    assert divide(10, 2) == 5.0
    assert divide(7, 2) == 3.5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)

# Run: pytest test_calculator.py -v` },
    { type: 'heading', content: { en: 'Fixtures and parametrize', pt: 'Fixtures e parametrize' } },
    { type: 'code', code: `import pytest

@pytest.fixture
def sample_list():
    return [1, 2, 3, 4, 5]

def test_sum(sample_list):
    assert sum(sample_list) == 15

def test_length(sample_list):
    assert len(sample_list) == 5

# Test multiple inputs at once
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected` }
  ]
)

export const phase14 = stub(14,
  { en: 'Git & GitHub', pt: 'Git e GitHub' },
  { en: 'Version control with Git and collaborate on GitHub — essential for every developer.', pt: 'Controle de versão com Git e colaboração no GitHub — essencial para todo desenvolvedor.' },
  '🔀', ['git'],
  [
    { type: 'heading', content: { en: 'Why use Git?', pt: 'Por que usar Git?' } },
    { type: 'text', content: { en: 'Git tracks every change you make to your code. You can go back to any previous version, work on different features simultaneously (branches), and collaborate with other developers without conflicts.', pt: 'Git rastreia cada mudança que você faz no código. Você pode voltar a qualquer versão anterior, trabalhar em funcionalidades diferentes simultaneamente (branches) e colaborar sem conflitos.' } },
    { type: 'code', code: `# Basic Git workflow

# 1. Initialize a repository
git init

# 2. Stage changes
git add .            # stage all files
git add file.py      # stage specific file

# 3. Commit
git commit -m "feat: add user login"

# 4. Connect to GitHub
git remote add origin https://github.com/user/repo.git
git push -u origin main

# 5. Daily workflow
git status           # see what changed
git diff             # see exact changes
git log --oneline    # see commit history
git pull             # get latest changes` },
    { type: 'heading', content: { en: 'Branching and merging', pt: 'Branches e merge' } },
    { type: 'code', code: `# Create and switch to new branch
git checkout -b feature/user-profile

# Make changes, commit...
git add .
git commit -m "feat: add profile page"

# Switch back to main
git checkout main

# Merge feature branch
git merge feature/user-profile

# Delete merged branch
git branch -d feature/user-profile

# See all branches
git branch -a` },
    { type: 'tip', content: { en: 'Good commit messages follow the format: <code>type: short description</code>. Types: feat (new feature), fix (bug fix), docs (documentation), style (formatting), refactor (code restructure).', pt: 'Boas mensagens de commit seguem o formato: <code>tipo: descrição curta</code>. Tipos: feat (nova funcionalidade), fix (correção de bug), docs (documentação), style (formatação), refactor (reestruturação).' } }
  ]
)

export const phase15 = stub(15,
  { en: 'Databases & SQL', pt: 'Bancos de Dados e SQL' },
  { en: 'Store and query data with SQL, SQLite, and SQLAlchemy ORM.', pt: 'Armazene e consulte dados com SQL, SQLite e SQLAlchemy ORM.' },
  '🗄️', ['sqlalchemy', 'sqlite3'],
  [
    { type: 'heading', content: { en: 'SQL fundamentals', pt: 'Fundamentos de SQL' } },
    { type: 'code', code: `import sqlite3

# Connect to database (creates file if not exists)
conn = sqlite3.connect("students.db")
cursor = conn.cursor()

# Create table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        grade REAL,
        city TEXT
    )
""")

# Insert data
cursor.execute("INSERT INTO students (name, grade, city) VALUES (?, ?, ?)",
               ("Alice", 92.5, "Toronto"))

# Insert many
students = [("Bob", 85.0, "Vancouver"), ("Carol", 78.5, "Montreal")]
cursor.executemany("INSERT INTO students (name, grade, city) VALUES (?, ?, ?)", students)

conn.commit()  # save changes

# Query data
cursor.execute("SELECT * FROM students WHERE grade > 80 ORDER BY grade DESC")
results = cursor.fetchall()
for row in results:
    print(row)

conn.close()` },
    { type: 'heading', content: { en: 'SQLAlchemy ORM', pt: 'SQLAlchemy ORM' } },
    { type: 'code', code: `from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    grade = Column(Float)
    
    def __repr__(self):
        return f"Student(name={self.name}, grade={self.grade})"

engine = create_engine("sqlite:///school.db")
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Add
alice = Student(name="Alice", grade=92.5)
session.add(alice)
session.commit()

# Query
students = session.query(Student).filter(Student.grade > 80).all()
for s in students:
    print(s)` }
  ]
)

export const phase16 = stub(16,
  { en: 'Data Science: NumPy & Pandas', pt: 'Ciência de Dados: NumPy e Pandas' },
  { en: 'Analyze real data with NumPy arrays and Pandas DataFrames.', pt: 'Analise dados reais com arrays NumPy e DataFrames Pandas.' },
  '📊', ['numpy', 'pandas'],
  [
    { type: 'heading', content: { en: 'NumPy — fast arrays', pt: 'NumPy — arrays rápidos' } },
    { type: 'code', code: `import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Math operations (applied to all elements)
print(arr * 2)          # [2 4 6 8 10]
print(arr ** 2)         # [1 4 9 16 25]
print(np.sqrt(arr))     # [1. 1.41 1.73 2. 2.23]

# Statistics
print(arr.mean())       # 3.0
print(arr.std())        # 1.41
print(arr.sum())        # 15

# Boolean indexing
print(arr[arr > 3])     # [4 5]` },
    { type: 'heading', content: { en: 'Pandas — data tables', pt: 'Pandas — tabelas de dados' } },
    { type: 'code', code: `import pandas as pd

# Create DataFrame
df = pd.DataFrame({
    "Name": ["Alice", "Bob", "Carol", "David"],
    "Age": [25, 30, 35, 28],
    "Salary": [70000, 85000, 92000, 78000],
    "Department": ["Engineering", "Marketing", "Engineering", "HR"]
})

# Explore
print(df.head())
print(df.info())
print(df.describe())

# Filter
engineers = df[df["Department"] == "Engineering"]
high_earners = df[df["Salary"] > 80000]

# Group and aggregate
avg_by_dept = df.groupby("Department")["Salary"].mean()
print(avg_by_dept)

# Sort
df_sorted = df.sort_values("Salary", ascending=False)

# Add column
df["Bonus"] = df["Salary"] * 0.10` }
  ]
)

export const phase17 = stub(17,
  { en: 'Data Visualization', pt: 'Visualização de Dados' },
  { en: 'Create beautiful charts with matplotlib, seaborn, and plotly.', pt: 'Crie gráficos bonitos com matplotlib, seaborn e plotly.' },
  '📈', ['matplotlib', 'seaborn', 'plotly'],
  [
    { type: 'heading', content: { en: 'matplotlib — the foundation', pt: 'matplotlib — a fundação' } },
    { type: 'code', code: `import matplotlib.pyplot as plt
import numpy as np

# Line chart
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, color='purple', linewidth=2, label='sin(x)')
plt.title('Sine Wave')
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('sine.png', dpi=150, bbox_inches='tight')
plt.show()

# Bar chart
categories = ['Python', 'JavaScript', 'Java', 'C++']
popularity = [30, 25, 20, 15]
plt.bar(categories, popularity, color=['#7c3aed', '#3b82f6', '#ef4444', '#f59e0b'])
plt.title('Language Popularity')
plt.show()` },
    { type: 'heading', content: { en: 'seaborn — statistical plots', pt: 'seaborn — gráficos estatísticos' } },
    { type: 'code', code: `import seaborn as sns
import pandas as pd

# Load built-in dataset
df = sns.load_dataset("iris")

# Distribution plot
sns.histplot(df["sepal_length"], bins=20, kde=True)

# Scatter with color by category
sns.scatterplot(data=df, x="sepal_length", y="petal_length", hue="species")

# Heatmap
correlation = df.select_dtypes(include=['float64']).corr()
sns.heatmap(correlation, annot=True, cmap="coolwarm")
plt.show()` }
  ]
)

export const phase18 = stub(18,
  { en: 'Machine Learning', pt: 'Machine Learning' },
  { en: 'Build predictive models with scikit-learn — regression, classification and evaluation.', pt: 'Construa modelos preditivos com scikit-learn — regressão, classificação e avaliação.' },
  '🤖', ['scikit-learn'],
  [
    { type: 'heading', content: { en: 'Your first ML model', pt: 'Seu primeiro modelo de ML' } },
    { type: 'text', content: { en: 'Machine learning is teaching a computer to find patterns in data. Instead of writing rules manually, you show the model examples and it learns the rules itself.', pt: 'Machine learning é ensinar um computador a encontrar padrões nos dados. Em vez de escrever regras manualmente, você mostra exemplos ao modelo e ele aprende as regras sozinho.' } },
    { type: 'code', code: `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Data: house size vs price
sizes = np.array([[500], [750], [1000], [1250], [1500], [1750], [2000]])
prices = np.array([150000, 200000, 250000, 310000, 375000, 425000, 500000])

# Split: 80% train, 20% test
X_train, X_test, y_train, y_test = train_test_split(sizes, prices, test_size=0.2, random_state=42)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
print(f"R² score: {r2_score(y_test, predictions):.3f}")

# Predict new house
new_house = np.array([[1800]])
price = model.predict(new_house)[0]
print(f"Predicted price for 1800 sqft: \${price:,.0f}")` },
    { type: 'heading', content: { en: 'Classification with Random Forest', pt: 'Classificação com Random Forest' } },
    { type: 'code', code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.3f}")
print(classification_report(y_test, predictions, target_names=iris.target_names))` }
  ]
)

export const phase19 = stub(19,
  { en: 'Web APIs with FastAPI', pt: 'APIs Web com FastAPI' },
  { en: 'Build modern REST APIs with automatic docs, validation and authentication.', pt: 'Construa APIs REST modernas com docs automáticos, validação e autenticação.' },
  '⚡', ['fastapi', 'uvicorn', 'pydantic'],
  [
    { type: 'heading', content: { en: 'Your first FastAPI app', pt: 'Seu primeiro app FastAPI' } },
    { type: 'code', code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="My API", version="1.0")

# Data model with validation
class Student(BaseModel):
    name: str
    grade: float
    city: Optional[str] = None

# In-memory database
students_db: List[Student] = []

@app.get("/")
def root():
    return {"message": "Welcome to the API!"}

@app.get("/students")
def get_students():
    return students_db

@app.post("/students", status_code=201)
def create_student(student: Student):
    students_db.append(student)
    return student

@app.get("/students/{name}")
def get_student(name: str):
    for s in students_db:
        if s.name == name:
            return s
    raise HTTPException(status_code=404, detail="Student not found")

# Run: uvicorn main:app --reload
# Docs: http://localhost:8000/docs` },
    { type: 'tip', content: { en: 'FastAPI generates interactive documentation automatically at /docs. You can test all your endpoints directly in the browser — no Postman needed!', pt: 'FastAPI gera documentação interativa automaticamente em /docs. Você pode testar todos os endpoints diretamente no browser — sem Postman!' } }
  ]
)

export const phase20 = stub(20,
  { en: 'Django — Full Web Framework', pt: 'Django — Framework Web Completo' },
  { en: 'Build complete web applications with Django MVT, ORM, admin and authentication.', pt: 'Construa aplicações web completas com Django MVT, ORM, admin e autenticação.' },
  '🌍', ['django', 'djangorestframework']
)

export const phase21 = stub(21,
  { en: 'Automation: Browser & Desktop', pt: 'Automação: Browser e Desktop' },
  { en: 'Automate web browsers with Playwright and Selenium — scraping, testing, bots.', pt: 'Automatize navegadores web com Playwright e Selenium — scraping, testes, bots.' },
  '🤖', ['playwright', 'selenium']
)

export const phase22 = stub(22,
  { en: 'Automation: Files, Excel & Scheduling', pt: 'Automação: Arquivos, Excel e Agendamento' },
  { en: 'Automate Excel reports, PDFs, and schedule tasks to run automatically.', pt: 'Automatize relatórios Excel, PDFs e agende tarefas para rodar automaticamente.' },
  '📋', ['openpyxl', 'reportlab', 'schedule']
)

export const phase23 = stub(23,
  { en: 'CLI Tools with Typer', pt: 'Ferramentas CLI com Typer' },
  { en: 'Build professional command-line tools with Typer, Click and Rich.', pt: 'Construa ferramentas de linha de comando profissionais com Typer, Click e Rich.' },
  '⌨️', ['typer', 'click', 'rich']
)

export const phase24 = stub(24,
  { en: 'Async Python & Concurrency', pt: 'Python Assíncrono e Concorrência' },
  { en: 'Write async code with asyncio, aiohttp, and understand threading vs multiprocessing.', pt: 'Escreva código assíncrono com asyncio, aiohttp e entenda threading vs multiprocessing.' },
  '⚡', ['asyncio', 'aiohttp', 'httpx']
)

export const phase25 = stub(25,
  { en: 'Docker & CI/CD Deployment', pt: 'Docker e Deploy CI/CD' },
  { en: 'Containerize apps with Docker and automate deployment with GitHub Actions.', pt: 'Containerize apps com Docker e automatize deploy com GitHub Actions.' },
  '🐳', ['docker']
)

export const phase26 = stub(26,
  { en: 'AI Integration', pt: 'Integração com IA' },
  { en: 'Build AI-powered tools using the Anthropic and OpenAI APIs in Python.', pt: 'Construa ferramentas com IA usando as APIs da Anthropic e OpenAI em Python.' },
  '🧠', ['anthropic', 'langchain', 'chromadb']
)

export const phase27 = stub(27,
  { en: 'Final Project', pt: 'Projeto Final' },
  { en: 'Build a complete production system combining everything you learned across all 26 phases.', pt: 'Construa um sistema de produção completo combinando tudo que aprendeu nas 26 fases anteriores.' },
  '🏆'
)

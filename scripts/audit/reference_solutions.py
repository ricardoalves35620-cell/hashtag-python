"""
One correct solution per factory-built exercise in phases 9-20.

Each is written from the task's STATED rules only — not from the pinned expectation.
That is the whole point: if a solution that follows the description fails the exercise's
own test, the exercise has a requirement it never told the learner about, and the
mismatch is the finding.

Kept in its own module so the solutions are readable Python rather than strings inside
strings. verify-expectations.py runs them.
"""

REFERENCES = {}


def solution(exercise_id):
    def keep(fn):
        import inspect
        source = inspect.getsource(fn)
        body = source.split('\n', 2)[2]          # drop the decorator and the def line
        import textwrap
        REFERENCES[exercise_id] = textwrap.dedent(body).rstrip()
        return fn
    return keep


# ── phase 9 · nested lists ───────────────────────────────────────────────────
@solution('p9-guided-cell')
def _p9_guided():
    def cell_at(table, row, column):
        return table[row][column]


@solution('p9-complete-column')
def _p9_complete():
    def column_values(table, column):
        values = []
        for row in table:
            values.append(row[column])
        return values


@solution('p9-zero-approved-total')
def _p9_zero():
    def approved_total(rows, platform_fee):
        total = 0
        for name, amount, status in rows:
            if status == "approved":
                total += max(amount - platform_fee, 0)
        return total


@solution('p9-transfer')
def _p9_transfer():
    def transpose_grid(grid):
        if not grid:
            return []
        width = len(grid[0])
        for row in grid:
            if len(row) != width:
                raise ValueError("ragged grid")
        # A for loop rather than a comprehension: phase 9 has not taught comprehensions
        # yet — they arrive in phase 12 — and the task now says to use one.
        transposed = []
        for index in range(width):
            column = []
            for row in grid:
                column.append(row[index])
            transposed.append(column)
        return transposed


# ── phase 10 · dictionaries ──────────────────────────────────────────────────
@solution('p10-guided-label')
def _p10_guided():
    def product_label(product):
        return product["sku"] + " - " + product["name"]


@solution('p10-complete-stock')
def _p10_complete():
    def sell_units(product, sold):
        if sold < 0:
            raise ValueError("negative sale")
        updated = dict(product)
        updated["stock"] = max(updated["stock"] - sold, 0)
        return updated


@solution('p10-zero-required')
def _p10_zero():
    def calculate_total(order):
        for key in ("quantity", "unit_price"):
            if key not in order:
                raise ValueError("missing keys")
        discount = order.get("discount", 0)
        if order["quantity"] < 0 or order["unit_price"] < 0 or discount < 0:
            raise ValueError("negative value")
        return round(order["quantity"] * order["unit_price"] * (1 - discount), 2)


@solution('p10-transfer')
def _p10_transfer():
    def merge_settings(base, changes, allowed):
        for key in changes:
            if key not in allowed:
                raise ValueError("unknown setting")
        merged = dict(base)
        merged.update(changes)
        return merged


# ── phase 11 · lists of dictionaries ─────────────────────────────────────────
@solution('p11-guided-active')
def _p11_guided():
    def active_names(records):
        names = []
        for record in records:
            if record["active"]:
                names.append(record["name"])
        return names


@solution('p11-complete-inventory')
def _p11_complete():
    def inventory_value(products):
        total = 0
        for product in products:
            if product["price"] < 0 or product["stock"] < 0:
                raise ValueError("negative product")
            total += product["price"] * product["stock"]
        return total


@solution('p11-zero-index')
def _p11_zero():
    def index_by_id(records):
        index = {}
        for record in records:
            if record["id"] in index:
                raise ValueError("duplicate id")
            index[record["id"]] = dict(record)
        return index


@solution('p11-transfer')
def _p11_transfer():
    def group_titles_by_category(items):
        grouped = {}
        for item in items:
            if "category" not in item or "title" not in item:
                raise ValueError("missing keys")
            grouped.setdefault(item["category"], []).append(item["title"])
        return grouped


# ── phase 12 · comprehensions ────────────────────────────────────────────────
@solution('p12-guided-even-squares')
def _p12_guided():
    def even_squares(values):
        return [value ** 2 for value in values if value % 2 == 0]


@solution('p12-complete-names')
def _p12_complete():
    def clean_names(names):
        return [name.strip().lower() for name in names if name.strip()]


@solution('p12-zero-products')
def _p12_zero():
    def available_labels(products):
        if any(product["stock"] < 0 for product in products):
            raise ValueError("negative stock")
        return [product["sku"] + ":" + product["name"]
                for product in products if product["stock"] > 0]


@solution('p12-transfer')
def _p12_transfer():
    def positive_cells(grid):
        for row in grid:
            for cell in row:
                if isinstance(cell, bool) or not isinstance(cell, (int, float)):
                    raise ValueError("non-numeric cell")
        return [cell for row in grid for cell in row if cell > 0]


# ── phase 13 · strings and numbers ───────────────────────────────────────────
@solution('p13-guided-label')
def _p13_guided():
    def clean_label(label):
        cleaned = label.strip().title()
        return cleaned


@solution('p13-complete-total')
def _p13_complete():
    def order_total(prices):
        if any(price < 0 for price in prices):
            raise ValueError("negative price")
        total = sum(prices)
        return total


@solution('p13-zero-status')
def _p13_zero():
    def reading_status(value):
        if value < 0:
            return "low"
        if value <= 100:
            return "normal"
        return "high"


@solution('p13-transfer')
def _p13_transfer():
    def net_hours(entries):
        total = 0
        for planned, blocked in entries:
            if planned < 0 or blocked < 0:
                raise ValueError("negative hours")
            total += planned - blocked
        return total

    def workload_label(hours):
        if hours < 20:
            return "light"
        if hours <= 40:
            return "balanced"
        return "heavy"


# ── phase 14 · parameters and defaults ───────────────────────────────────────
@solution('p14-guided-greeting')
def _p14_guided():
    def greet(name, language="en"):
        clean = name.strip()
        if language == "pt":
            return f"Olá, {clean}"
        return f"Hello, {clean}"


@solution('p14-complete-fee')
def _p14_complete():
    def service_fee(amount, rate=0.05, *, minimum=0):
        if amount < 0 or rate < 0 or minimum < 0:
            raise ValueError("negative fee value")
        calculated = amount * rate
        return round(max(calculated, minimum), 2)


@solution('p14-zero-tags')
def _p14_zero():
    def collect_tag(tag, tags=None):
        if tags is None:
            tags = []
        tags.append(tag.strip().lower())
        return tags


@solution('p14-transfer')
def _p14_transfer():
    def export_name(base, extension="csv", *, compressed=False):
        cleaned = base.strip()
        if not cleaned:
            raise ValueError("empty base")
        if extension not in ("csv", "json"):
            raise ValueError("unsupported extension")
        name = cleaned + "." + extension
        if compressed:
            name = name + ".gz"
        return name


# ── phase 15 · docstrings ────────────────────────────────────────────────────
@solution('p15-guided-doc')
def _p15_guided():
    def normalize_code(value):
        """Return a normalized code."""
        return value.strip().upper()


@solution('p15-complete-contract')
def _p15_complete():
    def rectangle_area(width, height):
        """Return the area of a rectangle.

        Args:
            width: Non-negative width.
            height: Non-negative height.

        Returns:
            The numeric area.
        """
        if width < 0 or height < 0:
            raise ValueError("negative dimension")
        return width * height


@solution('p15-zero-errors')
def _p15_zero():
    def average_score(scores):
        """Return the mean of the scores.

        Raises:
            ValueError: empty scores
        """
        if not scores:
            raise ValueError("empty scores")
        return round(sum(scores) / len(scores), 2)


@solution('p15-transfer')
def _p15_transfer():
    def format_distance(km):
        """Return the distance as text.

        Example:
            format_distance(1.5)
        """
        if km < 0:
            raise ValueError("negative distance")
        return f"{km:.2f} km"


# ── phase 16 · scope ─────────────────────────────────────────────────────────
@solution('p16-guided-update')
def _p16_guided():
    def add_points(current, earned):
        if earned < 0:
            raise ValueError("negative points")
        new_total = current + earned
        return new_total


@solution('p16-complete-shadow')
def _p16_complete():
    status = "global"

    def local_status(value):
        status = value.upper()
        return status


@solution('p16-zero-balance')
def _p16_zero():
    def apply_changes(start, changes):
        total = start
        for change in changes:
            if isinstance(change, bool) or not isinstance(change, (int, float)):
                raise ValueError("invalid change")
            total += change
        return total


@solution('p16-transfer')
def _p16_transfer():
    # The task now states the uppercase step. It did not before: the test fed " info "
    # and demanded "INFO: started", so a solution that followed the description exactly
    # failed with no way to see why. verify-expectations.py is what found it.
    def make_prefix(prefix):
        cleaned = prefix.strip().upper()
        if not cleaned:
            raise ValueError("empty prefix")

        def label(value):
            return cleaned + ": " + value

        return label


# ── phase 17 · text files ────────────────────────────────────────────────────
@solution('p17-guided')
def _p17_guided():
    def meaningful_lines(text):
        return [line.strip() for line in text.splitlines() if line.strip()]


@solution('p17-complete')
def _p17_complete():
    def parse_stock(text):
        records = []
        for raw_line in text.splitlines():
            if not raw_line.strip():
                continue
            sku, name, quantity_text = [part.strip() for part in raw_line.split("|")]
            quantity = int(quantity_text)
            if quantity < 0:
                raise ValueError("negative quantity")
            records.append({"sku": sku, "name": name, "quantity": quantity})
        return records


@solution('p17-zero')
def _p17_zero():
    def read_nonempty(path):
        cleaned = []
        with open(path, "r", encoding="utf-8") as file:
            for line in file:
                stripped = line.strip()
                if stripped:
                    cleaned.append(stripped)
        return cleaned


@solution('p17-transfer')
def _p17_transfer():
    def load_tasks(path):
        tasks = []
        with open(path, "r", encoding="utf-8") as file:
            for line in file:
                if not line.strip():
                    continue
                parts = line.strip().split(";")
                if len(parts) != 2:
                    raise ValueError("invalid task line")
                title = parts[0].strip()
                try:
                    priority = int(parts[1])
                except ValueError:
                    raise ValueError("invalid task line")
                if priority < 1 or priority > 5:
                    raise ValueError("invalid task line")
                tasks.append({"title": title, "priority": priority})
        return sorted(tasks, key=lambda task: (task["priority"], task["title"]))


# ── phase 18 · writing files ─────────────────────────────────────────────────
@solution('p18-guided')
def _p18_guided():
    def format_report(title, rows):
        lines = [title.strip()]
        for key, value in rows:
            lines.append(f"{key}={value}")
        return "\n".join(lines) + "\n"


@solution('p18-complete')
def _p18_complete():
    def save_lines(path, lines):
        count = 0
        with open(path, "w", encoding="utf-8") as file:
            for item in lines:
                file.write(str(item) + "\n")
                count += 1
        return count


@solution('p18-zero')
def _p18_zero():
    import csv

    def export_products(path, products):
        for product in products:
            if product["quantity"] < 0:
                raise ValueError("negative inventory")
        ordered = sorted(products, key=lambda product: product["sku"])
        with open(path, "w", encoding="utf-8", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["sku", "name", "quantity"])
            for product in ordered:
                writer.writerow([product["sku"], product["name"], product["quantity"]])
        return len(ordered)


@solution('p18-transfer')
def _p18_transfer():
    import os

    def atomic_save(path, text):
        data = text.encode("utf-8")
        temporary = path + ".tmp"
        with open(temporary, "wb") as file:
            file.write(data)
        os.replace(temporary, path)
        return len(data)


# ── phase 19 · JSON ──────────────────────────────────────────────────────────
@solution('p19-guided')
def _p19_guided():
    import json as _json

    def decode_profile(text):
        data = _json.loads(text)
        if not isinstance(data, dict):
            raise ValueError("profile must be an object")
        name = data.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("name is required")
        tags = data.get("tags", [])
        return {"name": name.strip(), "tags": sorted({str(tag).lower() for tag in tags})}


@solution('p19-complete')
def _p19_complete():
    import json as _json

    def encode_settings(settings):
        if not isinstance(settings, dict):
            raise ValueError("settings must be an object")
        return _json.dumps(settings, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


@solution('p19-zero')
def _p19_zero():
    import json as _json

    def order_total(text):
        items = _json.loads(text)
        total = 0
        for item in items:
            price = item.get("price")
            quantity = item.get("quantity")
            if isinstance(price, bool) or not isinstance(price, (int, float)):
                raise ValueError("invalid item")
            if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity < 0:
                raise ValueError("invalid item")
            total += price * quantity
        return round(total, 2)


@solution('p19-transfer')
def _p19_transfer():
    import json as _json

    def update_json_file(path, key, value):
        with open(path, "r", encoding="utf-8") as file:
            data = _json.load(file)
        if not isinstance(data, dict):
            raise ValueError("settings must be an object")
        data[key] = value
        with open(path, "w", encoding="utf-8") as file:
            _json.dump(data, file, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        return len(data)


# ── phase 20 · dates ─────────────────────────────────────────────────────────
@solution('p20-guided')
def _p20_guided():
    from datetime import date

    def days_between(start, end):
        return (date.fromisoformat(end) - date.fromisoformat(start)).days


@solution('p20-complete')
def _p20_complete():
    from datetime import date, timedelta

    def due_date(start, days):
        if days < 0:
            raise ValueError("days must be non-negative")
        return (date.fromisoformat(start) + timedelta(days=days)).isoformat()


@solution('p20-zero')
def _p20_zero():
    from datetime import date

    def deadline_status(opened, today, limit):
        opened_date = date.fromisoformat(opened)
        today_date = date.fromisoformat(today)
        if opened_date > today_date:
            raise ValueError("opened date is in the future")
        age = (today_date - opened_date).days
        return ("overdue:" if age > limit else "on-time:") + str(age)


@solution('p20-transfer')
def _p20_transfer():
    from datetime import date, timedelta

    def schedule_dates(start, offsets):
        start_date = date.fromisoformat(start)
        dates = []
        for offset in offsets:
            if isinstance(offset, bool) or not isinstance(offset, int) or offset < 0:
                raise ValueError("invalid offset")
            dates.append((start_date + timedelta(days=offset)).isoformat())
        return dates


# ═══ phases 0-8 ═══════════════════════════════════════════════════════════════
# These are whole programs rather than functions: the learner's script IS the answer,
# so the reference is a complete correct script and the test feeds stdin.

@solution('base0-first-output')
def _base0_first():
    file_name = "meu_primeiro.py"
    print("Running:", file_name)
    print("Python is ready")


@solution('base0-fill-extension')
def _base0_fill():
    python_extension = ".py"
    long_term_files = "storage"
    print(python_extension)
    print(long_term_files)


@solution('ex1_fill')
def _ex1_fill():
    print("=== SYSTEM START ===")
    print("App:", "MusicBox")
    print("New songs:", 47)
    print("New playlists:", 12)
    print("Total:", 47 + 12)


@solution('ex1_zero')
def _ex1_zero():
    print("--- COFFEE SHOP REPORT ---")
    print("Coffees sold:", 80)
    print("Price per coffee:", 5)
    print("Total revenue:", 80 * 5)
    print("Report complete!")


@solution('ex2_fill')
def _ex2_fill():
    amount = 8000
    discount = 300
    after_ded = amount - discount
    refund = after_ded * 0.75
    print("After discount:", after_ded)
    print("Final refund:", refund)


@solution('ex2_zero')
def _ex2_zero():
    budget = 48000
    materials = budget * 0.30
    teachers = budget * 0.45
    equipment = budget * 0.15
    admin = budget * 0.10
    print("Materials:", materials)
    print("Teachers:", teachers)
    print("Equipment:", equipment)
    print("Admin:", admin)
    print("Total check:", materials + teachers + equipment + admin)


@solution('ex3_fill')
def _ex3_fill():
    client_name = "Maria"
    client_age = 35
    monthly_fee = 450
    plan_active = True
    annual_fee = monthly_fee * 12
    print(f"Client: {client_name}, age {client_age}")
    print(f"Annual: {annual_fee}")
    print(f"Active: {plan_active}")


@solution('ex3_zero')
def _ex3_zero():
    total = 0
    total = total + 120
    print("After Monday:", total)
    total = total + 95
    print("After Tuesday:", total)
    total = total + 140
    print("After Wednesday:", total)
    print(f"3-day total: ${total}")


# The three fill-in exercises that take input(). They had no reference, so every checker
# that works by running a program skipped them in silence — which is how phases 7 and 8
# got caught promising English output while phases 4-6 went unread entirely.


@solution('ex4_fill')
def _ex4_fill():
    name = input("Name: ")
    age = int(input("Age: "))
    height = float(input("Height (m): "))
    phone = input("Phone: ")

    print(f"{name}, {age} years, {height}m")
    print(f"Next year: {age + 1}")
    print(f"Phone: {phone}")


@solution('ex5_fill')
def _ex5_fill():
    amount = int(input("Amount: $"))
    days = int(input("Days since plan start: "))

    if amount > 5000 and days < 30:
        print("🚨 FLAGGED for investigation")
    else:
        print("✅ Passed fraud check")


@solution('ex6_fill')
def _ex6_fill():
    age = int(input("Age: "))
    base = 1000

    if age < 21:
        fee = base * 2.2
    elif age < 26:
        fee = base * 1.6
    elif age < 60:
        fee = base * 1.0
    else:
        fee = base * 1.5

    print("Fee:", fee)


@solution('ex6_zero')
def _ex6_zero():
    score = 9.2
    if score >= 9:
        print("\U0001f44d Highly Recommended")
    elif score >= 7:
        print("Worth Watching")
    elif score >= 5:
        print("Average")
    else:
        print("Not Recommended")


@solution('ex7_fill')
def _ex7_fill():
    stock = 60
    order = 1
    while stock >= 15:
        stock -= 15
        print(f"Order {order}: {stock} cups left")
        order += 1
    print("Restock needed!")


@solution('ex7_zero')
def _ex7_zero():
    total = 0
    counter = 1
    while counter <= 4:
        value = int(input(f"Order {counter} value: "))
        total = total + value
        counter = counter + 1
    print("Total:", total)
    print("Average:", total / 4)


@solution('ex8_fill')
def _ex8_fill():
    amounts = [1200, 4500, 8000, 650]
    total = 0
    for amount in amounts:
        refund = amount - 250
        total += refund
        if amount > 3000:
            print("Big order:", amount)
    print("Total:", total)


@solution('ex8_zero')
def _ex8_zero():
    songs = [210, 195, 300, 180, 265, 240, 320]
    total = 0
    long_songs = 0
    for duration in songs:
        total += duration
        if duration > 240:
            long_songs += 1
    print("Total time:", total, "seconds")
    print("Long songs (>4 min):", long_songs)
    # The task now says "rounded to two decimal places". It used to demand
    # 244.28571428571428 exactly, so rounding an average — the obvious thing a learner
    # does — failed the exercise.
    print("Average:", round(total / len(songs), 2), "seconds")


# ── phases 21-27 ─────────────────────────────────────────────────────────────
#
# Written from each task's stated rules, never from the expectation it is checked
# against. Where one of these disagrees with the pinned value, the disagreement is the
# finding: either the expectation is wrong or the task never disclosed a requirement.


@solution('ex21_zero')
def _ex21_zero():
    import random
    random.seed(42)

    high_risk = 0
    for index in range(5):
        repair_value = random.randint(500, 12000)
        quote = repair_value - 250
        risk = "HIGH" if repair_value > 5000 else "normal"
        if repair_value > 5000:
            high_risk += 1
        print(f"Quote {index + 1}: ${repair_value} → ${quote} [{risk}]")

    print("High risk:", high_risk)


@solution('p21-transfer')
def _p21_transfer():
    import random

    def draw_numbers(seed, count):
        generator = random.Random(seed)
        return [generator.randint(1, 10) for _ in range(count)]


@solution('ex22_zero')
def _ex22_zero():
    import math

    principal = 10000
    rate = 0.08
    years = 5

    amount = principal * math.pow(1 + rate, years)
    rounded = math.ceil(amount)

    print(f"After {years} years: ${amount:.2f}")
    print(f"Rounded up: ${rounded}")


@solution('p22-transfer')
def _p22_transfer():
    import math

    def circle_area(radius):
        if radius < 0:
            raise ValueError("radius must not be negative")
        return round(math.pi * radius ** 2, 2)


@solution('ex23_zero')
def _ex23_zero():
    amount = None

    while amount is None:
        try:
            raw = input("Order amount: $")
            amount = int(raw)
            if amount <= 0:
                raise ValueError("Must be positive")
        except ValueError as error:
            print("Invalid:", error, "— try again")
            amount = None

    print("Confirmed total: $", amount - 250)


@solution('p23-transfer')
def _p23_transfer():
    def safe_total(raw, discount=250):
        try:
            amount = int(raw)
        except (TypeError, ValueError):
            return None
        if amount <= 0:
            return None
        return amount - discount


@solution('ex24_zero')
def _ex24_zero():
    def calculate(x, op, y):
        """Perform arithmetic. Raises ValueError on invalid input."""
        if op == "+":
            return x + y
        elif op == "-":
            return x - y
        elif op == "*":
            return x * y
        elif op == "/":
            if y == 0:
                raise ValueError("Cannot divide by zero")
            return x / y
        else:
            raise ValueError(f"Unknown operator: {op}")

    history = []
    tests = [(10, "+", 5), (20, "/", 4), (8, "/", 0)]

    for x, op, y in tests:
        try:
            result = calculate(x, op, y)
        except ValueError as error:
            print("Error:", error)
        else:
            history.append(f"{x} {op} {y} = {result}")
            print("=", result)

    print()
    print("History:")
    for entry in history:
        print(" ", entry)


@solution('p24-transfer')
def _p24_transfer():
    def calculate(left, operator, right):
        if operator == "+":
            return left + right
        if operator == "-":
            return left - right
        if operator == "*":
            return left * right
        if operator == "/":
            if right == 0:
                raise ValueError("Cannot divide by zero")
            return left / right
        raise ValueError(f"Unknown operator: {operator}")


@solution('ex25_zero')
def _ex25_zero():
    def create(db, client, pages):
        db.append({"id": len(db) + 1, "client": client, "pages": pages})

    def read_all(db):
        for record in db:
            print(f"#{record['id']} {record['client']} ${record['pages']}")

    def update(db, cid, new_pages):
        for record in db:
            if record["id"] == cid:
                record["pages"] = new_pages
                return True
        return False

    def delete(db, cid):
        db[:] = [record for record in db if record["id"] != cid]

    db = []
    create(db, "Alice", 5230)
    create(db, "Bob", 1200)
    create(db, "Carlos", 8000)
    create(db, "Diana", 900)

    print("Initial:")
    read_all(db)

    update(db, 2, 9000)
    delete(db, 4)

    print("Final:")
    read_all(db)


@solution('p25-transfer')
def _p25_transfer():
    def update_amount(db, order_id, new_amount):
        for record in db:
            if record["id"] == order_id:
                record["amount"] = new_amount
                return True
        return False


@solution('ex26_zero')
def _ex26_zero():
    sales = [5230, 1200, 8000, 450, 3100, 9200, 620, 4500, 7800, 2300]

    total = sum(sales)
    average = total / len(sales)
    minimum = min(sales)
    maximum = max(sales)
    median = sorted(sales)[len(sales) // 2]
    net_total = sum(value - 250 for value in sales)
    critical = len([value for value in sales if value > 8000])
    urgent = len([value for value in sales if 3000 <= value <= 8000])
    normal = len([value for value in sales if value < 3000])
    top3 = sorted(sales, reverse=True)[:3]

    print("=== REPORT ===")
    print(f"Total: ${total:,} | Avg: ${average:,.0f}")
    print(f"Min: ${minimum} | Max: ${maximum} | Median: ${median}")
    print(f"Net total: ${net_total:,}")
    print(f"Critical:{critical} Urgent:{urgent} Normal:{normal}")
    print(f"Top 3: {top3}")


@solution('p26-transfer')
def _p26_transfer():
    def summarize_values(values):
        if not values:
            raise ValueError("values must not be empty")
        return {
            "total": sum(values),
            "average": sum(values) / len(values),
            "minimum": min(values),
            "maximum": max(values),
        }


@solution('p27-transfer')
def _p27_transfer():
    def register_order(client, raw_amount, discount=250):
        try:
            amount = int(raw_amount)
        except (TypeError, ValueError):
            return None
        if amount <= 0:
            return None
        return {"client": client, "amount": amount, "total": amount - discount}


@solution('ex27_zero')
def _ex27_zero():
    from datetime import datetime

    def create_order(db, client, amount, ded=250):
        if amount <= 0:
            raise ValueError("Must be positive")
        priority = "Critical" if amount > 10000 else "Urgent" if amount > 5000 else "Normal"
        db.append({"id": len(db) + 1, "client": client, "amount": amount,
                   "total": amount - ded, "priority": priority, "status": "open",
                   "date": datetime.now().strftime("%Y-%m-%d")})

    def read_all(db):
        for record in db:
            print(f"#{record['id']} {record['client']} ${record['amount']} "
                  f"[{record['priority']}] {record['status']}")

    def update_status(db, cid, status):
        for record in db:
            if record["id"] == cid:
                record["status"] = status
                return True
        return False

    def delete_order(db, cid):
        db[:] = [record for record in db if record["id"] != cid]

    def analyze(db):
        gross = sum(record["amount"] for record in db)
        net = sum(record["total"] for record in db)
        print(f"Orders:{len(db)} | Amount:${gross:,} | Total:${net:,}")

    db = []
    try:
        create_order(db, "Alice", 12000)
        create_order(db, "Bob", 3500)
        create_order(db, "Carlos", 7800)
        create_order(db, "Diana", 900)
        create_order(db, "Eduardo", -1)
    except ValueError as error:
        print(f"Error: {error}")

    update_status(db, 1, "approved")
    update_status(db, 3, "approved")
    delete_order(db, 4)

    print("=== SYSTEM ===")
    read_all(db)
    print("=== STATS ===")
    analyze(db)


# ── phases 28-39 ─────────────────────────────────────────────────────────────
#
# The `-transfer` exercises state their contract in the starter docstring, so these are
# written from that. The `-practice` ones carry a single summary line and say the contract
# is "described above", which is a disclosure problem in its own right — each is written
# from the summary plus the shape its own tests call for, and any disagreement between the
# two is the finding.


@solution('p28-practice')
def _p28_practice():
    def project_manifest(package, modules):
        paths = [f"src/{package}/__init__.py"]
        for module in modules:
            paths.append(f"src/{package}/{module}.py")
        paths.append(f"tests/test_{package}.py")
        return paths


@solution('p28-transfer')
def _p28_transfer():
    def misplaced_files(paths):
        wrong = []
        for path in paths:
            name = path.split("/")[-1]
            expected = "tests" if name.startswith("test_") else "src"
            if not path.startswith(expected + "/"):
                wrong.append(path)
        return sorted(wrong)


@solution('p29-practice')
def _p29_practice():
    def dependency_plan(packages):
        seen = set()
        for entry in packages:
            seen.add(entry.strip().lower())
        return sorted(seen)


@solution('p29-transfer')
def _p29_transfer():
    def unpinned_packages(lines):
        names = []
        for line in lines:
            entry = line.strip()
            if not entry or entry.startswith("#"):
                continue
            if "==" in entry:
                continue
            for separator in (">=", "<=", "~=", ">", "<", "!="):
                if separator in entry:
                    entry = entry.split(separator)[0]
                    break
            names.append(entry.strip())
        return sorted(names)


@solution('p30-practice')
def _p30_practice():
    def public_api(module, names):
        public = sorted({name for name in names if not name.startswith("_")})
        return "\n".join(f"from {module} import {name}" for name in public)


@solution('p30-transfer')
def _p30_transfer():
    def import_cycle(imports):
        for module, targets in imports.items():
            for target in targets:
                if module in imports.get(target, []):
                    return sorted([module, target])
        return []


@solution('p31-practice')
def _p31_practice():
    def package_tree(name, modules):
        paths = [f"src/{name}/__init__.py"]
        for module in modules:
            paths.append(f"src/{name}/{module}.py")
            paths.append(f"tests/test_{module}.py")
        return paths


@solution('p31-transfer')
def _p31_transfer():
    def missing_init(paths):
        directories = set()
        has_init = set()
        for path in paths:
            if not path.endswith(".py"):
                continue
            folder = "/".join(path.split("/")[:-1])
            if not folder:
                continue
            directories.add(folder)
            if path.endswith("/__init__.py"):
                has_init.add(folder)
        return sorted(directories - has_init)


@solution('p32-practice')
def _p32_practice():
    def parse_command(args):
        if not args:
            return {"command": "help", "value": None}
        return {"command": args[0], "value": args[1] if len(args) > 1 else None}


@solution('p32-transfer')
def _p32_transfer():
    def usage_error(args):
        if not args:
            return "missing command"
        if args[0] not in ("add", "list"):
            return f"unknown command: {args[0]}"
        if args[0] == "add" and len(args) < 2:
            return "add needs a name"
        return ""


@solution('p33-practice')
def _p33_practice():
    def next_git_command(state):
        if state == "modified":
            return "git diff"
        if state == "staged":
            return "git commit"
        if state == "clean":
            return "git log"
        return "git status"


@solution('p33-transfer')
def _p33_transfer():
    def subject_problems(subjects):
        problems = []
        for subject in subjects:
            if len(subject) > 50:
                reason = "too long"
            elif not subject[:1].isupper():
                reason = "not capitalised"
            elif subject.endswith("."):
                reason = "ends with a period"
            else:
                continue
            problems.append(f"{subject} -> {reason}")
        return problems


@solution('p34-practice')
def _p34_practice():
    def evaluate_cases(function, cases):
        return ["PASS" if function(value) == expected else "FAIL" for value, expected in cases]


@solution('p34-transfer')
def _p34_transfer():
    def untested_cases(required, test_names):
        lowered = [name.lower() for name in test_names]
        missing = [case for case in required
                   if not any(case.lower() in name for name in lowered)]
        return sorted(missing)


@solution('p35-practice')
def _p35_practice():
    def safe_ratio(total, count):
        if count == 0:
            return 0.0
        return total / count


@solution('p35-transfer')
def _p35_transfer():
    def last_own_frame(lines):
        found = ""
        for line in lines:
            if "student_code.py" in line:
                found = line.strip()
        return found


@solution('p36-practice')
def _p36_practice():
    def log_event(level, message, context=None):
        pairs = " ".join(f"{key}={context[key]}" for key in sorted(context or {}))
        return f"{level.upper()} | {message} | {pairs}" if pairs else f"{level.upper()} | {message}"


@solution('p36-transfer')
def _p36_transfer():
    def resolved_settings(defaults, environment):
        resolved = dict(defaults)
        rejected = []
        for key, value in environment.items():
            if key in defaults:
                resolved[key] = value
            else:
                rejected.append(key)
        return resolved, sorted(rejected)


@solution('p37-practice')
def _p37_practice():
    from dataclasses import dataclass

    @dataclass(frozen=True)
    class Transaction:
        amount: float
        kind: str

    def net_total(items):
        total = 0
        for item in items:
            total += item.amount if item.kind == "income" else -item.amount
        return total


@solution('p37-transfer')
def _p37_transfer():
    def invalid_records(records, schema):
        problems = []
        for index, record in enumerate(records):
            for field, expected in schema.items():
                if field not in record or not isinstance(record[field], expected):
                    problems.append(f"{index}: {field}")
                    break
        return problems


@solution('p38-practice')
def _p38_practice():
    class Product:
        def __init__(self, name, price):
            self.name = name
            self.price = price

    def catalog_total(products):
        return sum(product.price for product in products)


@solution('p38-transfer')
def _p38_transfer():
    def shelf_report(shelves, items):
        lines = []
        for shelf in shelves:
            owned = [item for item in items if item["shelf"] == shelf]
            total = sum(item["price"] for item in owned)
            lines.append(f"{shelf} count={len(owned)} total={total}")
        return lines


@solution('p39-practice')
def _p39_practice():
    def monthly_summary(transactions):
        income = sum(entry["amount"] for entry in transactions if entry["kind"] == "income")
        expense = sum(entry["amount"] for entry in transactions if entry["kind"] == "expense")
        return {"income": income, "expense": expense, "balance": income - expense}


@solution('p39-transfer')
def _p39_transfer():
    def top_categories(entries, limit):
        totals = {}
        for entry in entries:
            totals[entry["category"]] = totals.get(entry["category"], 0) + entry["amount"]
        ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0]))
        return [f"{name}={total}" for name, total in ranked[:limit]]

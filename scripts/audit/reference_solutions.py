"""
One correct solution per graded exercise, phases 0-68.

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
    score = float(input("Score (0-10): "))
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


# ── phases 40-68 · authored 2026-07-30 from task statements only ──────────
# Written from description + starter docstring + codeRequirements, with the
# expectations withheld from the authors. Ambiguity notes for entries whose
# contract left something material unstated live in the commit message; a
# mismatch below is a finding about the exercise, not about the reference.

REFERENCES['p40-practice'] = 'def take(iterable, count):\n    """Return at most count items from any iterable."""\n    it = iter(iterable)\n    result = []\n    for _ in range(count):\n        try:\n            result.append(next(it))\n        except StopIteration:\n            break\n    return result\n'

REFERENCES['p40-transfer'] = 'def every_other(items):\n    """Return every second item of an iterable, starting with the first.\n\n    Works on anything you can loop over, not just lists.\n    """\n    result = []\n    for index, item in enumerate(items):\n        if index % 2 == 0:\n            result.append(item)\n    return result\n'

REFERENCES['p41-practice'] = 'def batched(items, size):\n    """Yield lists of at most size items."""\n    batch = []\n    for item in items:\n        batch.append(item)\n        if len(batch) == size:\n            yield batch\n            batch = []\n    if batch:\n        yield batch\n'

REFERENCES['p41-transfer'] = 'def running_totals(numbers):\n    """Yield the running total after each number.\n\n    Produce values one at a time rather than building the whole list first.\n    """\n    total = 0\n    for number in numbers:\n        total += number\n        yield total\n'

REFERENCES['p42-practice'] = 'def make_multiplier(factor):\n    """Return a function that multiplies by factor."""\n    def multiplier(value):\n        return value * factor\n    return multiplier\n'

REFERENCES['p42-transfer'] = 'import functools\n\n\ndef count_calls(function):\n    """Wrap a function so it counts how many times it was called.\n\n    Return the wrapper. It must expose the tally as wrapper.calls and still\n    return whatever the original function returned.\n    """\n    @functools.wraps(function)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return function(*args, **kwargs)\n\n    wrapper.calls = 0\n    return wrapper\n'

REFERENCES['p43-practice'] = 'from contextlib import contextmanager\n\n@contextmanager\ndef managed_flag(events):\n    events.append("enter")\n    try:\n        yield\n    finally:\n        events.append("exit")\n'

REFERENCES['p43-transfer'] = 'from contextlib import contextmanager\n\n\n@contextmanager\ndef collecting():\n    """A context manager that collects everything appended inside it.\n\n    Entering gives a fresh list. On exit the list must be left untouched so the\n    caller can still read what was collected.\n    """\n    items = []\n    yield items\n'

REFERENCES['p44-practice'] = 'class Money:\n    def __init__(self, amount, currency="CAD"):\n        self.amount = amount\n        self.currency = currency\n    def __repr__(self):\n        return f"Money({self.amount!r}, {self.currency!r})"\n    def __add__(self, other):\n        if not isinstance(other, Money) or other.currency != self.currency:\n            return NotImplemented\n        return Money(self.amount + other.amount, self.currency)\n\ndef combine_money(values):\n    # Revealed by the pinned test, stated nowhere in the task: an empty\n    # sequence combines to Money(0, \'CAD\').\n    total = Money(0)\n    for value in values:\n        total = total + value\n    return total\n'

REFERENCES['p44-transfer'] = 'class Duration:\n    """A Duration in minutes that adds with + and prints as \\"<n>min\\"."""\n\n    def __init__(self, minutes):\n        self.minutes = minutes\n\n    def __add__(self, other):\n        return Duration(self.minutes + other.minutes)\n\n    def __str__(self):\n        return f"{self.minutes}min"\n'

REFERENCES['p45-practice'] = 'from typing import Protocol\n\nclass Formatter(Protocol):\n    def format(self, value: object) -> str: ...\n\ndef render(values, formatter: Formatter):\n    """Return each value formatted by the supplied collaborator."""\n    return [formatter.format(value) for value in values]\n'

REFERENCES['p45-transfer'] = 'def describe_all(items):\n    """Return the description of every item that can describe itself.\n\n    An item can when it has a callable `describe`. Skip the ones that cannot\n    rather than failing on them.\n    """\n    descriptions = []\n    for item in items:\n        describe = getattr(item, "describe", None)\n        if callable(describe):\n            descriptions.append(describe())\n    return descriptions\n'

REFERENCES['p46-practice'] = 'import asyncio\n\nasync def gather_values(values):\n    """Double values concurrently and preserve input order."""\n    async def double(value):\n        return value * 2\n    return list(await asyncio.gather(*(double(value) for value in values)))\n'

REFERENCES['p46-transfer'] = 'def ordered_results(requested, finished):\n    """Return results in the order they were requested, not the order they finished.\n\n    `finished` maps a task name to its result. `requested` is the order to\n    report them in. A task with no result yet reports None.\n    """\n    return [finished.get(task) for task in requested]\n'

REFERENCES['p47-practice'] = 'def partition_work(items, workers):\n    """Distribute items round-robin into worker buckets."""\n    buckets = [[] for _ in range(workers)]\n    for index, item in enumerate(items):\n        buckets[index % workers].append(item)\n    return buckets\n'

REFERENCES['p47-transfer'] = 'def balance_load(sizes, workers):\n    """Split work across workers so the totals are as close as possible.\n\n    Give each next item to whichever worker currently has the least. Return the\n    total each worker ends up with.\n    """\n    totals = [0] * workers\n    for size in sizes:\n        lightest = totals.index(min(totals))\n        totals[lightest] += size\n    return totals\n'

REFERENCES['p48-practice'] = 'def unique_expensive_calls(values):\n    """Return squared results and number of unique computations."""\n    cache = {}\n    results = []\n    for value in values:\n        if value not in cache:\n            cache[value] = value * value\n        results.append(cache[value])\n    return results, len(cache)\n'

REFERENCES['p48-transfer'] = 'def memoized_calls(arguments):\n    # Revealed by the pinned test, stated nowhere in the task: the\n    # "underlying work" squares its argument.\n    cache = {}\n    computations = 0\n    results = []\n    for argument in arguments:\n        if argument not in cache:\n            cache[argument] = argument * argument\n            computations += 1\n        results.append(cache[argument])\n    return results, computations\n'

REFERENCES['p49-practice'] = 'def build_order_query(status, limit):\n    """Return parameterized SQL and a parameter tuple."""\n    query = "SELECT * FROM orders WHERE status = ? LIMIT ?"\n    params = (status, limit)\n    return query, params\n'

REFERENCES['p49-transfer'] = 'def where_clause(filters):\n    """Build a WHERE clause and its parameters from a filter mapping.\n\n    Return the clause and a list of values, with the columns in sorted order.\n    An empty filter produces an empty clause and no values.\n    """\n    columns = sorted(filters)\n    clause = " AND ".join("{} = ?".format(column) for column in columns)\n    values = [filters[column] for column in columns]\n    return clause, values\n'

REFERENCES['p50-practice'] = 'def normalize_response(status, payload):\n    # Revealed by the pinned tests: the normalized shape is a dict whose\n    # "error" key holds the MESSAGE pulled out of the payload, not the payload.\n    if 200 <= status < 300:\n        return {"ok": True, "data": payload, "error": None}\n    return {"ok": False, "data": None, "error": payload.get("error")}\n'

REFERENCES['p50-transfer'] = 'def retryable(codes):\n    """Return the status codes worth retrying, in the order given.\n\n    A request is worth retrying when the server failed (500 and above) or asked\n    you to slow down (429). A client mistake is not worth retrying.\n    """\n    return [code for code in codes if code >= 500 or code == 429]\n'

REFERENCES['p51-practice'] = 'def redact_record(record, secret_keys):\n    """Return a new dictionary with secret values replaced by ***."""\n    return {key: ("***" if key in secret_keys else value)\n            for key, value in record.items()}\n'

REFERENCES['p51-transfer'] = 'def unsafe_fields(names):\n    """Return the field names that must never cross a public boundary, sorted.\n\n    A field is unsafe when its name contains any of: password, token, secret.\n    The match ignores capitalisation.\n    """\n    keywords = ("password", "token", "secret")\n    return sorted(\n        name for name in names\n        if any(keyword in name.lower() for keyword in keywords)\n    )\n'

REFERENCES['p52-practice'] = 'def release_ready(checks):\n    # Revealed by the pinned tests: the return is a dict with "ready" and the\n    # "failures" listed in canonical check order.\n    required = ("types", "tests", "security", "build")\n    failures = [name for name in required if checks.get(name) is not True]\n    return {"ready": not failures, "failures": failures}\n'

REFERENCES['p52-transfer'] = 'def version_bump(version, kind):\n    """Return the next version for a kind of change.\n\n    \\"major\\" resets minor and patch, \\"minor\\" resets patch, \\"patch\\" adds one.\n    Anything else returns the version unchanged.\n    """\n    major, minor, patch = (int(part) for part in version.split("."))\n    if kind == "major":\n        return f"{major + 1}.0.0"\n    if kind == "minor":\n        return f"{major}.{minor + 1}.0"\n    if kind == "patch":\n        return f"{major}.{minor}.{patch + 1}"\n    return version\n'

REFERENCES['p53-practice'] = 'def process_orders(orders, tax_rate):\n    # Revealed by the pinned tests: orders are dicts with quantity and\n    # unit_price, and the return is a dict with a rounded "total".\n    subtotal = 0.0\n    for order in orders:\n        subtotal += order["quantity"] * order["unit_price"]\n    tax = round(subtotal * tax_rate, 2)\n    total = round(subtotal + tax, 2)\n    return {"subtotal": round(subtotal, 2), "tax": tax, "total": total}\n'

REFERENCES['p53-transfer'] = 'def reconcile(left, right):\n    """Compare two ledgers and report what differs.\n\n    Return three sorted lists: ids only on the left, only on the right, and ids\n    present in both whose amounts disagree.\n    """\n    only_left = sorted(key for key in left if key not in right)\n    only_right = sorted(key for key in right if key not in left)\n    differing = sorted(\n        key for key in left\n        if key in right and left[key] != right[key]\n    )\n    return only_left, only_right, differing\n'

REFERENCES['p54-practice'] = 'def dot_product(a, b):\n    """Return the dot product and reject different lengths."""\n    if len(a) != len(b):\n        raise ValueError("vectors must have the same length")\n    return sum(x * y for x, y in zip(a, b))\n'

REFERENCES['p54-transfer'] = 'import math\n\n\ndef magnitude(vector):\n    """Return the length of a vector, rounded to two decimal places.\n\n    The length is the square root of the sum of the squared components.\n    """\n    return round(math.sqrt(sum(component ** 2 for component in vector)), 2)\n'

REFERENCES['p55-practice'] = 'import numpy as np\n\ndef normalize_vector(values):\n    """Return a float NumPy vector with L2 norm 1; preserve zero vector."""\n    vector = np.asarray(values, dtype=float)\n    norm = np.linalg.norm(vector)\n    if norm == 0:\n        return vector\n    return vector / norm\n'

REFERENCES['p55-transfer'] = 'def scale_rows(rows):\n    """Divide every row by its own largest absolute value.\n\n    A row of all zeros is left as it is rather than dividing by zero. Round each\n    result to two decimal places.\n    """\n    scaled = []\n    for row in rows:\n        largest = max((abs(value) for value in row), default=0)\n        if largest == 0:\n            scaled.append(list(row))\n        else:\n            scaled.append([round(value / largest, 2) for value in row])\n    return scaled\n'

REFERENCES['p56-practice'] = 'import pandas as pd\n\ndef clean_records(records):\n    # Revealed by the pinned tests: the return is a list of plain records,\n    # not a DataFrame, and "invalid" means a non-numeric amount.\n    df = pd.DataFrame(records)\n    df["status"] = df["status"].astype(str).str.strip().str.lower()\n    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")\n    df = df.dropna(subset=["amount"])\n    df = df.drop_duplicates()\n    df = df.sort_values("amount").reset_index(drop=True)\n    return df.to_dict("records")\n'

REFERENCES['p56-transfer'] = 'def column_gaps(records):\n    """Report how many values each column is missing.\n\n    A value is missing when it is None or an empty string. Report every column\n    that appears in any record, sorted, even when nothing is missing.\n    """\n    columns = set()\n    for record in records:\n        columns.update(record)\n    gaps = {}\n    for column in sorted(columns):\n        missing = 0\n        for record in records:\n            value = record.get(column)\n            if value is None or value == "":\n                missing += 1\n        gaps[column] = missing\n    return gaps\n'

REFERENCES['p57-practice'] = 'def classification_metrics(tp, fp, fn):\n    """Return precision, recall and F1, using 0 for undefined divisions."""\n    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0\n    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0\n    if precision + recall > 0:\n        f1 = 2 * precision * recall / (precision + recall)\n    else:\n        f1 = 0.0\n    return precision, recall, f1\n'

REFERENCES['p57-transfer'] = 'def confusion_counts(actual, predicted):\n    """Count true positives, false positives, true negatives and false negatives.\n\n    Return them in that order. Labels are 1 for positive and 0 for negative.\n    """\n    tp = fp = tn = fn = 0\n    for a, p in zip(actual, predicted):\n        if a == 1 and p == 1:\n            tp += 1\n        elif a == 0 and p == 1:\n            fp += 1\n        elif a == 0 and p == 0:\n            tn += 1\n        else:\n            fn += 1\n    return tp, fp, tn, fn\n'

REFERENCES['p58-practice'] = 'def split_dataset(items, train_ratio=0.6, validation_ratio=0.2):\n    """Return train, validation and test slices without overlap."""\n    items = list(items)\n    n = len(items)\n    train_end = int(n * train_ratio)\n    validation_end = train_end + int(n * validation_ratio)\n    return items[:train_end], items[train_end:validation_end], items[validation_end:]\n'

REFERENCES['p58-transfer'] = 'def fold_indices(size, folds):\n    """Split a dataset into k folds of consecutive indices.\n\n    Earlier folds take the extra item when the size does not divide evenly.\n    """\n    base, extra = divmod(size, folds)\n    result = []\n    start = 0\n    for fold in range(folds):\n        length = base + (1 if fold < extra else 0)\n        result.append(list(range(start, start + length)))\n        start += length\n    return result\n'

REFERENCES['p59-practice'] = 'def linear_predict(xs, weight, bias):\n    """Return one prediction for each x."""\n    return [weight * x + bias for x in xs]\n'

REFERENCES['p59-transfer'] = 'def mean_absolute_error(actual, predicted):\n    """Return the mean absolute error, rounded to three decimal places.\n\n    An empty pair of lists has an error of 0.0.\n    """\n    if not actual:\n        return 0.0\n    total = sum(abs(a - p) for a, p in zip(actual, predicted))\n    return round(total / len(actual), 3)\n'

REFERENCES['p60-practice'] = 'def classify_scores(scores, threshold=0.5):\n    """Return 1 for scores at or above threshold, else 0."""\n    return [1 if score >= threshold else 0 for score in scores]\n'

REFERENCES['p60-transfer'] = 'from collections import Counter\n\n\ndef label_counts(labels):\n    """Count how many times each label appears, most common first.\n\n    Ties are broken alphabetically by label.\n    """\n    counts = Counter(labels)\n    return sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))\n'

REFERENCES['p61-practice'] = 'def gradient_step(weight, x, target, learning_rate):\n    """Apply one MSE gradient step for prediction weight*x."""\n    prediction = weight * x\n    gradient = 2 * (prediction - target) * x\n    return weight - learning_rate * gradient\n'

REFERENCES['p61-transfer'] = 'def relu_forward(values):\n    """Apply ReLU to every value: keep positives, replace anything else with 0.\n    """\n    return [value if value > 0 else 0 for value in values]\n'

REFERENCES['p62-practice'] = 'def training_step(weight, x, target, learning_rate):\n    """Return updated weight and pre-update MSE loss."""\n    prediction = weight * x\n    error = prediction - target\n    loss = error ** 2\n    gradient = 2 * error * x\n    new_weight = weight - learning_rate * gradient\n    return new_weight, loss\n'

REFERENCES['p62-transfer'] = 'def epoch_losses(batches):\n    # Revealed by the pinned tests: the return is a LIST of averages in\n    # increasing epoch order, not a mapping.\n    return [round(sum(batches[epoch]) / len(batches[epoch]), 3)\n            for epoch in sorted(batches)]\n'

REFERENCES['p63-practice'] = 'def build_vocabulary(texts):\n    """Return <unk>:0 plus sorted unique lowercase whitespace tokens."""\n    tokens = set()\n    for text in texts:\n        for token in text.lower().split():\n            tokens.add(token)\n    vocabulary = {"<unk>": 0}\n    for index, token in enumerate(sorted(tokens), start=1):\n        vocabulary[token] = index\n    return vocabulary\n'

REFERENCES['p63-transfer'] = 'from collections import Counter\n\n\ndef rare_tokens(tokens, minimum):\n    """Return the tokens that appear fewer than `minimum` times, sorted.\n    """\n    counts = Counter(tokens)\n    return sorted(token for token, count in counts.items() if count < minimum)\n'

REFERENCES['p64-practice'] = 'import math\n\ndef softmax(values):\n    """Return numerically stable probabilities summing to 1."""\n    values = list(values)\n    highest = max(values)\n    exps = [math.exp(value - highest) for value in values]\n    total = sum(exps)\n    return [value / total for value in exps]\n'

REFERENCES['p64-transfer'] = 'def attention_mask(length):\n    """Build a causal mask: position i may attend to positions up to and including i.\n\n    Return a square grid of 1 for allowed and 0 for blocked.\n    """\n    return [[1 if col <= row else 0 for col in range(length)]\n            for row in range(length)]\n'

REFERENCES['p65-practice'] = 'def estimated_weight_gb(parameters_billions, bits_per_weight):\n    """Estimate raw weight storage in decimal GB."""\n    total_bits = parameters_billions * 1e9 * bits_per_weight\n    total_bytes = total_bits / 8\n    return total_bytes / 1e9\n'

REFERENCES['p65-transfer'] = 'def fits_in_memory(sizes, available_gb):\n    """Return the quantisations whose weights fit in the memory available.\n\n    `sizes` maps a quantisation name to its size in GB. Report the ones that fit\n    in `available_gb`, largest first.\n    """\n    fitting = [name for name, size in sizes.items() if size <= available_gb]\n    return sorted(fitting, key=lambda name: (-sizes[name], name))\n'

REFERENCES['p66-practice'] = 'def local_runtime_command(model_path, context_size=4096):\n    """Return a safe llama-server command bound to localhost."""\n    return [\n        "llama-server",\n        "--model", model_path,\n        "--host", "127.0.0.1",\n        "--ctx-size", str(context_size),\n    ]\n'

REFERENCES['p66-transfer'] = 'def tool_allowed(name, path, allowed):\n    """Decide whether a tool call may run.\n\n    Return \\"\\" when it is allowed, otherwise the reason:\n      - the tool is not on the allow list -> \\"tool not allowed: <name>\\"\n      - the tool is allowed but the path leaves the sandbox -> \\"path escapes sandbox\\"\n    A path escapes when it contains \\"..\\".\n    """\n    if name not in allowed:\n        return f"tool not allowed: {name}"\n    if ".." in path:\n        return "path escapes sandbox"\n    return ""\n'

REFERENCES['p67-practice'] = 'def chunk_words(text, size, overlap=0):\n    # Revealed by the pinned tests: chunks are space-joined strings and the\n    # trailing shorter chunk is kept.\n    words = text.split()\n    step = size - overlap\n    return [" ".join(words[start:start + size])\n            for start in range(0, len(words), step)]\n'

REFERENCES['p67-transfer'] = 'def overlapping_chunks(words, size, overlap):\n    # Revealed by the pinned tests: the trailing shorter chunk is kept.\n    if overlap >= size:\n        return []\n    step = size - overlap\n    return [words[start:start + size] for start in range(0, len(words), step)]\n'

REFERENCES['p68-practice'] = 'def answer_with_sources(question, passages):\n    # Revealed by the pinned tests: passages carry a "source" key, the return\n    # is always a dict, and no overlap means empty lists — the docstring\'s\n    # "insufficient evidence" is not a string return value.\n    question_words = set(question.lower().split())\n    scored = []\n    for passage in passages:\n        text = str(passage.get("text", ""))\n        overlap = len(question_words & set(text.lower().split()))\n        if overlap > 0:\n            scored.append((overlap, passage))\n    scored.sort(key=lambda pair: pair[0], reverse=True)\n    top = [passage for _, passage in scored[:2]]\n    return {\n        "passages": [passage.get("text") for passage in top],\n        "sources": [passage.get("source") for passage in top],\n    }\n'

REFERENCES['p68-transfer'] = 'def answer_confidence(scores):\n    """Report how well the retrieved sources support an answer.\n\n    Return \\"supported\\" when at least two sources score 0.7 or higher,\n    \\"weak\\" when exactly one does, and \\"insufficient\\" when none do.\n    """\n    strong = sum(1 for score in scores if score >= 0.7)\n    if strong >= 2:\n        return "supported"\n    if strong == 1:\n        return "weak"\n    return "insufficient"\n'

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
        return [[row[index] for row in grid] for index in range(width)]


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
            file.write(_json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
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
    print("Average:", total / len(songs), "seconds")

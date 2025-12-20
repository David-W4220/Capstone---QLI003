"""Generate PNG screenshots from Jest output text files.

Creates:
 - test-screenshots/jest-output.png  (full terminal output as text image)
 - test-screenshots/summary.png      (compact summary with pass/fail counts)

Usage:
    python scripts/generate_test_screenshots.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'test-screenshots'
OUT_DIR.mkdir(exist_ok=True)

INPUT = ROOT / 'jest-output.txt'
if not INPUT.exists():
    print(f"Input file not found: {INPUT}")
    raise SystemExit(1)

text = INPUT.read_text(encoding='utf-8', errors='replace')
lines = text.splitlines()

# Try to load a monospaced font; fall back to default
def load_mono_font(size=14):
    candidates = [
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\cour.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

font = load_mono_font(16)
# measure using draw.textbbox for compatibility
_temp_img = Image.new('RGB', (1, 1))
_temp_draw = ImageDraw.Draw(_temp_img)
bbox = _temp_draw.textbbox((0, 0), 'M', font=font)
char_w, char_h = bbox[2], bbox[3]
max_len = max((len(line) for line in lines), default=40)
img_w = min(1600, max_len * char_w + 40)
img_h = min(4000, (len(lines) + 1) * char_h + 40)

# If content is taller than img_h, we will wrap lines to fit width
max_chars_per_line = max(40, (img_w - 40) // char_w)
wrapped_lines = []
for line in lines:
    if len(line) <= max_chars_per_line:
        wrapped_lines.append(line)
    else:
        wrapped_lines.extend(textwrap.wrap(line, width=max_chars_per_line) or [''])

img_h = max(200, (len(wrapped_lines) + 1) * char_h + 40)
img = Image.new('RGB', (img_w, img_h), color=(255,255,255))
d = ImageDraw.Draw(img)

# render text
x = 20
y = 20
fill = (20,20,20)
for line in wrapped_lines:
    d.text((x, y), line, font=font, fill=fill)
    y += char_h

out_full = OUT_DIR / 'jest-output.png'
img.save(out_full)
print(f"Wrote full output image: {out_full}")

# Summary image: parse summary lines for Test Suites / Tests / Time
suites = next((l for l in reversed(lines) if l.strip().startswith('Test Suites:')), '')
tests = next((l for l in reversed(lines) if l.strip().startswith('Tests:')), '')
snap = next((l for l in reversed(lines) if l.strip().startswith('Snapshots:')), '')
time = next((l for l in reversed(lines) if l.strip().startswith('Time:')), '')
ran = next((l for l in reversed(lines) if l.strip().startswith('Ran all test suites.')), '')

summary_lines = ["Jest Test Summary", "", suites, tests, snap, time]
# small image
s_w = 800
s_h = 200
s_img = Image.new('RGB', (s_w, s_h), color=(245,245,245))
s_draw = ImageDraw.Draw(s_img)
heading_font = load_mono_font(20)
body_font = load_mono_font(16)

s_draw.text((20, 15), summary_lines[0], font=heading_font, fill=(0,80,0))
for i, l in enumerate(summary_lines[2:], start=0):
    s_draw.text((20, 60 + i*28), l, font=body_font, fill=(30,30,30))

out_summary = OUT_DIR / 'summary.png'
s_img.save(out_summary)
print(f"Wrote summary image: {out_summary}")
from PIL import Image, ImageDraw, ImageFont

img = Image.open("/home/ubuntu/umokay2-funnel/assets/images/day-zero-homework-final.png")
w, h = img.size
print(f"Image size: {w}x{h}")

draw = ImageDraw.Draw(img)

# The "CODE EXPIRES: APRIL 30, 2026" block is in the bottom-right area.
# Based on the cropped image (1127x641), it sits roughly at:
# x: ~840-1100, y: ~560-635
# Paint over it with the dark background colour of that area
cover_x1, cover_y1 = 835, 558
cover_x2, cover_y2 = 1120, 638
draw.rectangle([cover_x1, cover_y1, cover_x2, cover_y2], fill=(5, 8, 20))

# Now write the new text
try:
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    font_date  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
except:
    font_label = ImageFont.load_default()
    font_date  = font_label

# "CODE EXPIRES:" label in white
draw.text((840, 560), "CODE EXPIRES:", fill=(255, 255, 255), font=font_label)
# "MAY 18, 2026" in orange
draw.text((840, 582), "MAY 18, 2026", fill=(255, 140, 0), font=font_date)
# "12PM CDT" in orange
draw.text((840, 607), "12PM CDT", fill=(255, 140, 0), font=font_date)

img.save("/home/ubuntu/umokay2-funnel/assets/images/day-zero-homework-final.png")
print("Saved.")

from PIL import Image

img = Image.open("/home/ubuntu/umokay2-funnel/assets/images/day-zero-homework-final.png")
w, h = img.size
print(f"Original size: {w}x{h}")

# The image has a grey border/background around the actual card
# and a watermark star in the bottom-right corner.
# We'll crop to just the card content, removing the grey padding.
# Based on the screenshot, the card starts roughly at 16% from left,
# 3% from top, ends at 90% width, 92% height (cutting the star watermark)

left = int(w * 0.155)
top = int(h * 0.025)
right = int(w * 0.895)
bottom = int(h * 0.935)

cropped = img.crop((left, top, right, bottom))
print(f"Cropped size: {cropped.size}")
cropped.save("/home/ubuntu/umokay2-funnel/assets/images/day-zero-homework-final.png")
print("Saved.")

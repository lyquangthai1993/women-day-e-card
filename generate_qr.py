import qrcode
from PIL import Image

def generate_qr(url, output_path="qr-code-2010.png"):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=3,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#be123c", back_color="#ffffff") # Màu rose-700 sang trọng
    img.save(output_path)
    print(f"QR code successfully created at: {output_path} for URL: {url}")

if __name__ == "__main__":
    target_url = "https://lyquangthai1993.github.io/women-day-e-cart/"
    generate_qr(target_url)

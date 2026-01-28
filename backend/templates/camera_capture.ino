#include "esp_camera.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "driver/rtc_io.h"

#define PWDN_GPIO_NUM  46
#define RESET_GPIO_NUM -1
#define XCLK_GPIO_NUM  15
#define SIOD_GPIO_NUM  4
#define SIOC_GPIO_NUM  5

#define Y9_GPIO_NUM    16
#define Y8_GPIO_NUM    17
#define Y7_GPIO_NUM    18
#define Y6_GPIO_NUM    12
#define Y5_GPIO_NUM    10
#define Y4_GPIO_NUM    8
#define Y3_GPIO_NUM    9
#define Y2_GPIO_NUM    11
#define VSYNC_GPIO_NUM 6
#define HREF_GPIO_NUM  7
#define PCLK_GPIO_NUM  13

#define PIN_QWIIC_SDA 2
#define PIN_QWIIC_SCL 1
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
const uint8_t FRAME_HEADER[] = {0x46, 0x52, 0x41, 0x4D};
void setup() {
  Wire.begin(PIN_QWIIC_SDA,PIN_QWIIC_SCL);
  Serial.begin(115200);
  delay(1500);
    // Init OLED
  display.begin(SSD1306_SWITCHCAPVCC, 0x3D);
  display.setRotation(2);
  display.display();
  delay(100);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Initializing...");
  display.display();
    // Camera config
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_GRAYSCALE;
  config.frame_size = FRAMESIZE_96X96; // Small grayscale image
  config.jpeg_quality = 12;
  config.fb_count = 1;
  config.fb_location = CAMERA_FB_IN_DRAM;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
    // Initialize camera
  Serial.println("Init camera...");
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
  Serial.printf("Camera init failed: 0x%x", err);
  display.println("Camera init failed!");
  display.display();
  return;
  }
}
void loop() {
  // Capture image
camera_fb_t *fb = esp_camera_fb_get();
if (!fb) {
Serial.println("Capture failed");
display.println("Capture failed!");
display.display();
return;
  }
  // Prepare to draw
display.clearDisplay();
const int srcWidth = 96;
const int srcHeight = 96;
const int targetHeight = 64;
const int targetWidth = 64;
const int xOffset = (SCREEN_WIDTH - targetWidth) / 2;  // 32
  // Simple nearest-neighbor downscaling from 96x96 -> 64x64
for (int y = 0; y < targetHeight; y++) {
for (int x = 0; x < targetWidth; x++) {
      // Map target (x, y) to source (sx, sy)
int sx = x * srcWidth / targetWidth;
int sy = y * srcHeight / targetHeight;
uint8_t pixel = fb->buf[sy * srcWidth + sx];
if (pixel > 128) {
display.drawPixel(x + xOffset, y, WHITE);
      } else {
display.drawPixel(x + xOffset, y, BLACK);
      }
    }
  }
display.display();
Serial.write(FRAME_HEADER, 4);
Serial.write(fb->buf, 96*96);
  // Serial.println();
esp_camera_fb_return(fb);
}
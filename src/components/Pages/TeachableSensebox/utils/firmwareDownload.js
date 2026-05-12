/**
 * Downloads capture firmware for senseBox Eye
 * Shared utility used by ModelTrainer and SerialErrorHandler
 */

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

/**
 * Downloads the camera capture firmware binary
 * @param {string} boardType - Board type (default: "sensebox_eye")
 * @param {string} filename - Name for downloaded file (default: "camera_capture.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadCameraFirmware(
  boardType = "sensebox_eye",
  filename = "camera_capture.bin",
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/capture/camera`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to download firmware",
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    console.error("Failed to download firmware:", err);
    return { success: false, error: err.message };
  }
}

export default downloadCameraFirmware;

/**
 * Downloads accelerometer streaming firmware for senseBox Eye
 * @param {string} boardType - Board type (default: "sensebox_eye")
 * @param {string} filename - Name for downloaded file (default: "accelerometer.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadAccelerometerFirmware(
  boardType = "sensebox_eye",
  filename = "accelerometer_capture.bin",
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/capture/acceleration`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to download firmware",
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    console.error("Failed to download accelerometer firmware:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Downloads spell streaming firmware for senseBox Eye
 * @param {string} boardType - Board type (default: "sensebox_eye")
 * @param {string} filename - Name for downloaded file (default: "spell_capture.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadSpellFirmware(
  boardType = "sensebox_eye",
  filename = "spell_capture.bin",
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/capture/gesture`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to download firmware",
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (err) {
    console.error("Failed to download spell firmware:", err);
    return { success: false, error: err.message };
  }
}

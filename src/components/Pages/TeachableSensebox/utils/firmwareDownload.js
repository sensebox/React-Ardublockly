/**
 * Downloads capture firmware for senseBox MCU Eye
 * Shared utility used by ModelTrainer and SerialErrorHandler
 */

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5000";

/**
 * Downloads the camera capture firmware binary
 * @param {string} boardType - Board type (default: "sensebox_mcu_eye")
 * @param {string} filename - Name for downloaded file (default: "camera_capture.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadCameraFirmware(
  boardType = "sensebox_mcu_eye",
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

/**
 * Downloads the image collection ("collect") firmware binary
 * @param {string} boardType - Board type (default: "sensebox_mcu_eye")
 * @param {string[]} classNames - List of class names
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadCollectFirmware(
  boardType = "sensebox_mcu_eye",
  classNames = ["1", "2"],
) {
  try {
    const filename = `collect-${classNames.join("_")}.bin`;
    const response = await fetch(`${API_BASE_URL}/api/collect/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classNames: classNames,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to download firmware",
      );
    }

    const jsonResponse = await response.json();
    const data = jsonResponse.data;

    // Handle binary data - could be base64 string or array of bytes
    let bytes;
    if (typeof data.binaryData === "string") {
      // Base64 string - trim whitespace and decode
      const base64String = data.binaryData.trim();
      const binaryString = atob(base64String);
      bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
    } else if (Array.isArray(data.binaryData)) {
      // Already an array of bytes
      bytes = new Uint8Array(data.binaryData);
    } else {
        "Unexpected binaryData type:",
        typeof data.binaryData,
        "data:",
        data,
      );
      throw new Error(
        `Unexpected binaryData format: ${typeof data.binaryData}`,
      );
    }

    const blob = new Blob([bytes], { type: "application/octet-stream" });

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

/**
 * Downloads accelerometer streaming firmware for senseBox MCU Eye
 * @param {string} boardType - Board type (default: "sensebox_mcu_eye")
 * @param {string} filename - Name for downloaded file (default: "accelerometer.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadAccelerometerFirmware(
  boardType = "sensebox_mcu_eye",
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
 * Downloads spell streaming firmware for senseBox MCU Eye
 * @param {string} boardType - Board type (default: "sensebox_mcu_eye")
 * @param {string} filename - Name for downloaded file (default: "spell_capture.bin")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function downloadSpellFirmware(
  boardType = "sensebox_mcu_eye",
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

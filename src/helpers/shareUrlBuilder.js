import { EMBEDDED_CONFIG } from "@/config/embeddedConfig";
import { createId } from "mnemonic-id";

export const isEmbeddedPath = (pathname) => {
  return pathname === EMBEDDED_CONFIG.ROUTE || 
         pathname.startsWith(`${EMBEDDED_CONFIG.ROUTE}/`);
};

export const generateAppShareUrl = (shareId) => {
  return `blocklyconnect-app://share/${shareId}`;
};

export const generateWebShareUrl = (shareId) => {
  return `${window.location.origin}/share/${shareId}`;
};

export const createShareShortLink = async (
  shareId, 
  isEmbedded = false
) => {
  const webShareUrl = isEmbedded ? generateAppShareUrl(shareId) : generateWebShareUrl(shareId); 
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: `blockly-${createId(5)}`,
      url: webShareUrl,
    }),
  };
  
  try {
    const response = await fetch("https://www.snsbx.de/api/shorty", requestOptions);
    const data = await response.json();
    
    // Validate response structure
    if (Array.isArray(data) && data.length > 0 && data[0]?.link) {
      return data[0].link;
    }
    
    // Fallback if response structure is unexpected
    console.warn('Unexpected API response structure:', data);
    return webShareUrl;
  } catch (error) {
    console.error('Failed to create short link:', error);
    // Fallback to full URL if short link creation fails
    return webShareUrl;
  }
};


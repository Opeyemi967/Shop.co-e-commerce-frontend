// ================================================================
// IMAGE CONFIGURATION - PRODUCTION
// ================================================================

export const IMAGES = {
  hero: "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721012/shopco/hero/hero.jpg",
  casual:
    "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721018/shopco/styles/casual.jpg",
  formal:
    "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721026/shopco/styles/formal.jpg",
  party:
    "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721042/shopco/styles/party.jpg",
  gym: "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721089/shopco/styles/gym.jpg",
  aboutHero:
    "https://res.cloudinary.com/dwcctfqrq/image/upload/v1782721106/shopco/about/aboutHero.jpg",
};

export const getImage = (src, options = {}) => {
  if (!src) return null;

  const { width = 800, height = 600, quality = 80, crop = "fill" } = options;

  // CASE 1: It's a predefined key (e.g., "hero")
  if (IMAGES[src]) {
    const url = IMAGES[src];
    const isHero = ["hero", "aboutHero"].includes(src);
    const finalQuality = isHero ? 90 : quality;
    return url.replace(
      "/upload/",
      `/upload/w_${width},h_${height},q_${finalQuality},f_auto,c_${crop}/`
    );
  }

  // CASE 2: It's already a full URL (product image)
  if (src.startsWith("http")) {
    // Check if it's a Cloudinary URL
    if (src.includes("res.cloudinary.com")) {
      // Add transformations to existing Cloudinary URL
      const parts = src.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_${width},h_${height},q_${quality},f_auto,c_${crop},fl_progressive/${parts[1]}`;
      }
      return src;
    }

    // External URL - use Cloudinary fetch
    const cloudName = "dwcctfqrq";
    return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_${quality},w_${width},c_${crop}/${encodeURIComponent(
      src
    )}`;
  }

  // CASE 3: Unknown - return as is
  console.warn(`Unknown image source: ${src}`);
  return src;
};

export const getImageSafe = (src, options = {}) => {
  const result = getImage(src, options);
  return result || "";
};

export default { IMAGES, getImage, getImageSafe };

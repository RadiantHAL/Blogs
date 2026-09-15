/**
 * Optimizes ImageKit URLs by adding transformation parameters.
 * This reduces file size and improves LCP.
 */
export const optimizeImageUrl = (url: string, width = 800, quality = 80) => {
  if (!url) return "";

  // ImageKit transformation format: /ik/tr:w-800,q-80/path/to/image.jpg
  // We assume the URL already contains the ImageKit base path.
  // If the URL is already optimized, we don't want to double-optimize.
  if (url.includes("/tr:")) return url;

  // We insert the transformation string after the base domain/endpoint
  // Most ImageKit URLs look like: https://ik.imagekit.io/your_id/image.jpg
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const transformation = `/tr:w-${width},q-${quality},f-auto`;

    // Insert transformation after the first segment of the path if it's the ID
    // Example: /myid/image.jpg -> /myid/tr:w-800,q-80,f-auto/image.jpg
    const pathSegments = path.split('/');
    if (pathSegments.length > 2) {
        pathSegments[1] = `${pathSegments[1]}${transformation}`;
        return `${urlObj.origin}${pathSegments.join('/')}`;
    }

    return url;
  } catch (e) {
    return url;
  }
};

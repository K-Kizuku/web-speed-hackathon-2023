type MediaType = 'image' | 'video';

export function getMediaType(filename: string): MediaType {
  if (filename.endsWith('.webp')) {
    return 'image';
  }

  return 'video';
}


export default {
  size: 4 * 1024, // 4kB
  maxGrowSize: 4 * 1024 * 1024, // Next buffer size is 4MB max
  grow: 2, // Next buffer is twice the size
};

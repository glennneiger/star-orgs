import Cache from 'cache-storage';
import FileStorage from 'cache-storage/Storage/FileSyncStorage';
import MemoryStorage from 'cache-storage/Storage/MemorySyncStorage';

// Wraps an image retriever with caching
export default class CachingImageRetriever {
  constructor(imageRetriever, storageType = 'file') {
    if (!imageRetriever) {
      throw new Error('imageRetriever must be specified.');
    }

    if (storageType !== 'file' && storageType !== 'memory') {
      throw new Error('file or memory must be specified.');
    }

    this.imageRetriever = imageRetriever;
    this.storageType = storageType;

    const storage = storageType === 'file'
      ? new FileStorage(`${__dirname}/cache`)
      : new MemoryStorage();

    this.cache = new Cache(storage, 'graph-images');
  }

  getImage(email) {
    if (!email) {
      return Promise.resolve(null);
    }

    const cachedImage = this.cache.load(email);

    if (cachedImage !== null) {
      return Promise.resolve(new Buffer(cachedImage));
    }

    return this.imageRetriever
      .getImage(email)
      .then(image => {
        if (image !== null) {
          this.cache.save(email, image);
        }

        return image;
      });
  }

  clear() {
    this.cache.clean(Cache.ALL);
  }
}

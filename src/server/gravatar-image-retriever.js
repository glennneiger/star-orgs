import md5 from 'md5';
import rp from 'request-promise';

export default class GravatarImageRetriever {
  getImage(email) {
    if (!email) {
      return Promise.resolve(null);
    }

    const picturePxSize = 75;

    return rp({
      method: 'GET',
      encoding: null,
      simple: false,
      resolveWithFullResponse: true,

      // https://en.gravatar.com/site/implement/hash/
      // https://en.gravatar.com/site/implement/images/
      uri: `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}.jpg`
        + `?s=${picturePxSize}&r=g&d=404`
    }).then(res => {
      if (res.statusCode === 404) { // eslint-disable-line no-magic-numbers
        return null;
      }

      return res.body;
    });
  }
}

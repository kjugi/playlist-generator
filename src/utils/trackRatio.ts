/**
 * Generating how many tracks we can return per artis album
 *
 * @method trackRatio
 * @prop {number} songsPerAtrist
 * @prop {Array<number>} albumsPopularity
 *
 * @return {Array<number>} Songs per album in same order as albumsPopularity prop
 */

export const trackRatio = (
  songsPerArtist: number,
  albumsPopularity: Array<number>,
) => {
  const currentRatio = albumsPopularity.reduce((prev, current) => prev + current, 0);
  const newPercentageTotal = 100 / currentRatio;
  const percentagePerAlbum = albumsPopularity.map(singlePopularity => newPercentageTotal * singlePopularity);
  const songsPerAlbum = percentagePerAlbum.map(value => Math.round(songsPerArtist * (value / 100)));

  // TODO: Check is any album has more than 0 sons per album
  // Happens when artist has a lot of albums and songsPerArtist is low.
  // Let's run in the loop: cut the last album (less popular) and check for songsPerArtist count again
  return songsPerAlbum
};

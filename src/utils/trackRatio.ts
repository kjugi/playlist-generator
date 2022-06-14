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

  if (
    songsPerAlbum.reduce((sum, current) => sum + current, 0) !== songsPerArtist &&
    albumsPopularity.length > 0
  ) {
    // Happens when: many albums && low songsPerArtist
    // It could return all albums with values under 0,5 which results as 0 at the end
    //
    // Solution - do in the loop:
    // 1. Cut the last album (less popular)
    // 2. Check for songsPerArtist count again after new calculations
    const newAlbumsArray = albumsPopularity.slice(0, -1);

    return trackRatio(songsPerArtist, newAlbumsArray);
  }

  return songsPerAlbum
};

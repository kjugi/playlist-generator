/**
 * Psuedocode
 *
 * Input:
 * - songsPerArtist
 * - Array<albums.popularity>
 * -
 *
 * Calculations:
 * 1. Get currentRatio: sum(Array<albums.popularity>)
 * 2. Set new 100% value (totalValue): 100 / currentRatio
 * 3. get percentageValue of songs per album: totalValue * album.popularity
 * 4. convert to songsPerAlbum int value: Round(songsPerArtist * (percentageValue/100) ,2)
 * 5. Add value songsPerAlbum to object with key as albumId
 *
 * Output:
 * - Object{[albumId]: <number>}
 */

export const trackRatio = () => {

};

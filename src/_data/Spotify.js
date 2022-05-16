const SpotifyWebApi = require('spotify-web-api-node');

module.exports = async () => {

    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    const Api = new SpotifyWebApi({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET
    });

    const credentials = await Api.clientCredentialsGrant();
    Api.setAccessToken(credentials.body.access_token);

    const releases = await Api.getArtistAlbums(process.env.SPOTIFY_ARTIST_ID);

    const latestDate = new Date(Math.max(...releases.body.items.map(e => new Date(e.release_date))));
    const latestRelease = releases.body.items.find(r => new Date(r.release_date).toTimeString() === latestDate.toTimeString());

    const tracks = await Api.getAlbumTracks(latestRelease.id);

    const showcaseTrack = tracks.body.items.find(t => t.preview_url) || tracks.body.items[0];

    return {
        albumName: latestRelease.name,
        albumType: latestRelease.album_type,
        trackAmount: latestRelease.total_tracks,
        featuringArtists: showcaseTrack.artists.filter(a => a.id !== process.env.SPOTIFY_ARTIST_ID).map(a => a.name),
        trackName: showcaseTrack.name,
        previewUrl: showcaseTrack.preview_url,
        coverImageSrc: latestRelease.images.find(i => i.height == 64).url
    };
}
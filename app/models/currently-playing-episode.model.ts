import { HummingbirdAnime } from './hummingbird-anime.model';
import { HummingbirdAnimeEpisode } from './hummingbird-anime-episode.model';
import { HummingbirdGalleryImage } from './hummingbird-gallery-image.model';


export class CurrentlyPlayingEpisode {
    id: number;
    anime: HummingbirdAnime;
    episode: HummingbirdAnimeEpisode;
    images: HummingbirdGalleryImage[];

    constructor(id: number) {
        this.id = id;
        this.anime = new HummingbirdAnime({});
        this.episode = new HummingbirdAnimeEpisode();
        this.images = [];
    }
}
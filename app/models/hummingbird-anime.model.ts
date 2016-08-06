export class HummingbirdAnime {
    anime: {
        id: number;
        titles: {
            canonical: string;
            english: string;
            romanji: string;
            japanese: string;
        };
        slug: string;
        synopsis: string;
        started_airing_date: string;
        finished_airing_date: string;
        youtube_video_id: string;
        age_rating: string;
        episode_count: number;
        episode_length: number;
        show_type: number;
        poster_image: string;
        cover_image: string;
        community_rating: number;
        genres: string[];
        bayesian_rating: number;
        links: {
            gallery_images: number[];
            episodes: number[];
        };
    }

    constructor (response: any) {
        this.anime = response.anime;
    }
}
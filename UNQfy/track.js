class Track {

    constructor(id, name, genres, duration) {
        this.id = id;
        this.name = name;
        this.genres = genres;
        this.duration = duration;
        this.lyrics = null;
    };

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getGenres() {
        return this.genres;
    }

    getDuration() {
        return this.duration;
    }

    setLyrics(lyrics) {
        this.lyrics = lyrics;
        return this
    }

    hasLyrics() {
        return (this.lyrics !== null)
    }

    getLyrics() {
        return this.lyrics
    }
    trackInclude(genreNames) {
        return genreNames.some(genre => this.genres.indexOf(genre) >= 0)
    }

}
module.exports = Track;
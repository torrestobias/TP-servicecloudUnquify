class Track {

    constructor(id, name, genres, duration) {
        this.id = id;
        this.name = name;
        this.genres = genres;
        this.duration = duration;
    };

   getId(){
       return this.id;
   } 

   getName(){
       return this.name;
   }

   getGenres(){
       return this.genres;
   }

   getDuration(){
       return this.duration;
   }
}
module.exports = Track;
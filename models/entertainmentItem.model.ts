import mongoose, { Model } from 'mongoose'
const ParentFolder = require('./parentFolder.model')
const Account = require('./account.model')

const EntertainmentItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  // OneDrive fields
  parent_folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentFolder',
    required: true,
  },
  parent_folder_onedrive_id: {
    type: String,
    required: true,
  },
  onedrive_item_id: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  webURL: {
    type: String,
    required: true,
  },
  onedrive_id: {
    type: String,
    required: true,
  },
  site_id: {
    type: String,
    required: true,
  },

  // IMDB Fields
  imdb_id: {
    type: String,
  },
  genre: {
    type: [String],
  },
  tmdb_id: {
    type: String,
  },
  popularity: {
    type: Number,
  },
  adult: {
    type: Boolean,
  },
  budget: {
    type: Number,
  },
  release_date: {
    type: Date,
  },
  revenue: {
    type: Number,
  },
  status: {
    type: String,
  },
  vote_count: {
    type: Number,
  },
  vote_average: {
    type: Number,
  },
  type: {
    type: String,
  },
  backdrop_image: {
    type: String,
  },
  poster_image: {
    type: String,
  },
})

let EntertainmentItem: Model<any>
try {
  EntertainmentItem = mongoose.model('EntertainmentItem')
} catch (err) {
  EntertainmentItem = mongoose.model(
    'EntertainmentItem',
    EntertainmentItemSchema,
  )
}

export default EntertainmentItem

/*
{
  "adult": false,
  "backdrop_path": "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
  "belongs_to_collection": {
    "id": 263,
    "name": "The Dark Knight Collection",
    "poster_path": "/ogyw5LTmL53dVxsppcy8Dlm30Fu.jpg",
    "backdrop_path": "/xfKot7lqaiW4XpL5TtDlVBA9ei9.jpg"
  },
  "budget": 185000000,
  "genres": [
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 53,
      "name": "Thriller"
    }
  ],
  "homepage": "https://www.warnerbros.com/movies/dark-knight/",
  "id": 155,
  "imdb_id": "tt0468569",
  "original_language": "en",
  "original_title": "The Dark Knight",
  "overview": "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
  "popularity": 104.64,
  "poster_path": "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  "production_companies": [
    {
      "id": 429,
      "logo_path": "/2Tc1P3Ac8M479naPp1kYT3izLS5.png",
      "name": "DC Comics",
      "origin_country": "US"
    },
    {
      "id": 923,
      "logo_path": "/8M99Dkt23MjQMTTWukq4m5XsEuo.png",
      "name": "Legendary Pictures",
      "origin_country": "US"
    },
    {
      "id": 9996,
      "logo_path": "/3tvBqYsBhxWeHlu62SIJ1el93O7.png",
      "name": "Syncopy",
      "origin_country": "GB"
    },
    {
      "id": 118865,
      "logo_path": null,
      "name": "Isobel Griffiths",
      "origin_country": "GB"
    },
    {
      "id": 174,
      "logo_path": "/zhD3hhtKB5qyv7ZeL4uLpNxgMVU.png",
      "name": "Warner Bros. Pictures",
      "origin_country": "US"
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": "GB",
      "name": "United Kingdom"
    },
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    }
  ],
  "release_date": "2008-07-16",
  "revenue": 1004558444,
  "runtime": 152,
  "spoken_languages": [
    {
      "english_name": "English",
      "iso_639_1": "en",
      "name": "English"
    },
    {
      "english_name": "Mandarin",
      "iso_639_1": "zh",
      "name": "普通话"
    }
  ],
  "status": "Released",
  "tagline": "Welcome to a world without rules.",
  "title": "The Dark Knight",
  "video": false,
  "vote_average": 8.515,
  "vote_count": 31423
}
*/

/*
{
  "adult": false,
  "backdrop_path": "/butPVWgcbtAjL9Z7jU7Xj1KA8KD.jpg",
  "created_by": [
    {
      "id": 54772,
      "credit_id": "551da459c3a3683a18000dbe",
      "name": "Andy Cohen",
      "gender": 2,
      "profile_path": "/eZrNjW7RQgkhwfcBw0qGTLPVgf4.jpg"
    }
  ],
  "episode_run_time": [
    30
  ],
  "first_air_date": "2009-07-16",
  "genres": [
    {
      "id": 10767,
      "name": "Talk"
    },
    {
      "id": 35,
      "name": "Comedy"
    }
  ],
  "homepage": "http://www.bravotv.com/watch-what-happens-live",
  "id": 22980,
  "in_production": true,
  "languages": [
    "en"
  ],
  "last_air_date": "2024-02-19",
  "last_episode_to_air": {
    "id": 5149940,
    "name": "Da'Vine Joy Randolph & Second Gentleman Douglas Emhoff",
    "overview": "",
    "vote_average": 0,
    "vote_count": 0,
    "air_date": "2024-02-19",
    "episode_number": 31,
    "episode_type": "standard",
    "production_code": "",
    "runtime": 21,
    "season_number": 21,
    "show_id": 22980,
    "still_path": null
  },
  "name": "Watch What Happens Live with Andy Cohen",
  "next_episode_to_air": {
    "id": 5149941,
    "name": "Jenna Dewan & Tom Schwartz",
    "overview": "",
    "vote_average": 0,
    "vote_count": 0,
    "air_date": "2024-02-20",
    "episode_number": 32,
    "episode_type": "standard",
    "production_code": "",
    "runtime": 21,
    "season_number": 21,
    "show_id": 22980,
    "still_path": null
  },
  "networks": [
    {
      "id": 74,
      "logo_path": "/wX5HsfS47u6UUCSpYXqaQ1x2qdu.png",
      "name": "Bravo",
      "origin_country": "US"
    }
  ],
  "number_of_episodes": 1869,
  "number_of_seasons": 19,
  "origin_country": [
    "US"
  ],
  "original_language": "en",
  "original_name": "Watch What Happens Live with Andy Cohen",
  "overview": "Bravo network executive Andy Cohen discusses pop culture topics with celebrities and reality show personalities.",
  "popularity": 5060.225,
  "poster_path": "/onSD9UXfJwrMXWhq7UY7hGF2S1h.jpg",
  "production_companies": [
    {
      "id": 23601,
      "logo_path": "/jZYnbLWzOGhRDrvLWOOpoQZnuAB.png",
      "name": "Embassy Row",
      "origin_country": "US"
    },
    {
      "id": 11073,
      "logo_path": "/wHs44fktdoj6c378ZbSWfzKsM2Z.png",
      "name": "Sony Pictures Television Studios",
      "origin_country": "US"
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    }
  ],
  "seasons": [
    {
      "air_date": "2012-08-26",
      "episode_count": 5,
      "id": 32935,
      "name": "Specials",
      "overview": "",
      "poster_path": null,
      "season_number": 0,
      "vote_average": 0
    },
    {
      "air_date": "2009-07-16",
      "episode_count": 22,
      "id": 32928,
      "name": "Season 1",
      "overview": "",
      "poster_path": null,
      "season_number": 1,
      "vote_average": 0
    },
    {
      "air_date": "2010-01-14",
      "episode_count": 29,
      "id": 32929,
      "name": "Season 2",
      "overview": "",
      "poster_path": null,
      "season_number": 2,
      "vote_average": 0
    },
    {
      "air_date": "2010-09-09",
      "episode_count": 40,
      "id": 32930,
      "name": "Season 3",
      "overview": "",
      "poster_path": null,
      "season_number": 3,
      "vote_average": 0
    },
    {
      "air_date": null,
      "episode_count": 1,
      "id": 32931,
      "name": "Season 4",
      "overview": "",
      "poster_path": null,
      "season_number": 4,
      "vote_average": 0
    },
    {
      "air_date": "2011-12-11",
      "episode_count": 4,
      "id": 32932,
      "name": "Season 5",
      "overview": "",
      "poster_path": null,
      "season_number": 5,
      "vote_average": 0
    },
    {
      "air_date": "2012-01-08",
      "episode_count": 72,
      "id": 32933,
      "name": "Season 6",
      "overview": "",
      "poster_path": null,
      "season_number": 6,
      "vote_average": 0
    },
    {
      "air_date": "2012-06-17",
      "episode_count": 35,
      "id": 32934,
      "name": "Season 7",
      "overview": "",
      "poster_path": null,
      "season_number": 7,
      "vote_average": 0
    },
    {
      "air_date": "2012-09-09",
      "episode_count": 64,
      "id": 32936,
      "name": "Season 8",
      "overview": "",
      "poster_path": null,
      "season_number": 8,
      "vote_average": 0
    },
    {
      "air_date": "2013-01-06",
      "episode_count": 88,
      "id": 32937,
      "name": "Season 9",
      "overview": "",
      "poster_path": null,
      "season_number": 9,
      "vote_average": 0
    },
    {
      "air_date": "2013-06-16",
      "episode_count": 108,
      "id": 32938,
      "name": "Season 10",
      "overview": "",
      "poster_path": null,
      "season_number": 10,
      "vote_average": 0
    },
    {
      "air_date": null,
      "episode_count": 2,
      "id": 77111,
      "name": "Season 13",
      "overview": "",
      "poster_path": null,
      "season_number": 13,
      "vote_average": 0
    },
    {
      "air_date": "2017-01-03",
      "episode_count": 125,
      "id": 83411,
      "name": "Season 14",
      "overview": "",
      "poster_path": null,
      "season_number": 14,
      "vote_average": 0
    },
    {
      "air_date": "2018-01-07",
      "episode_count": 209,
      "id": 97793,
      "name": "Season 15",
      "overview": "",
      "poster_path": null,
      "season_number": 15,
      "vote_average": 6
    },
    {
      "air_date": "2019-01-06",
      "episode_count": 208,
      "id": 115656,
      "name": "Season 16",
      "overview": "",
      "poster_path": null,
      "season_number": 16,
      "vote_average": 0
    },
    {
      "air_date": "2020-01-05",
      "episode_count": 208,
      "id": 140166,
      "name": "Season 17",
      "overview": "",
      "poster_path": null,
      "season_number": 17,
      "vote_average": 0
    },
    {
      "air_date": "2021-01-03",
      "episode_count": 208,
      "id": 177920,
      "name": "Season 18",
      "overview": "",
      "poster_path": null,
      "season_number": 18,
      "vote_average": 0
    },
    {
      "air_date": "2022-01-05",
      "episode_count": 209,
      "id": 238733,
      "name": "Season 19",
      "overview": "",
      "poster_path": null,
      "season_number": 19,
      "vote_average": 0
    },
    {
      "air_date": "2023-01-02",
      "episode_count": 203,
      "id": 322933,
      "name": "Season 20",
      "overview": "",
      "poster_path": null,
      "season_number": 20,
      "vote_average": 0
    },
    {
      "air_date": "2024-01-07",
      "episode_count": 34,
      "id": 370457,
      "name": "Season 21",
      "overview": "",
      "poster_path": null,
      "season_number": 21,
      "vote_average": 0
    }
  ],
  "spoken_languages": [
    {
      "english_name": "English",
      "iso_639_1": "en",
      "name": "English"
    }
  ],
  "status": "Returning Series",
  "tagline": "",
  "type": "Talk Show",
  "vote_average": 5.1,
  "vote_count": 31
}
*/

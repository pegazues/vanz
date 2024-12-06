function generateInterface(obj) {
  if (typeof obj !== 'object' || obj === null) {
    console.error('Input must be a valid JavaScript object.')
    return
  }

  // Recursively generate the interface definition
  function generateInterfaceRec(obj, depth = 0) {
    let interfaceStr = ''

    // Indentation for better readability
    const indent = '    '.repeat(depth)

    // Iterate over object properties
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        // If the property is an object, recursively generate its interface
        interfaceStr += `${indent}${key}: {\n`
        interfaceStr += generateInterfaceRec(value, depth + 1)
        interfaceStr += `${indent}};\n`
      } else {
        // If the property is not an object, generate a simple type definition
        interfaceStr += `${indent}${key}: ${typeof value};\n`
      }
    }

    return interfaceStr
  }

  // Generate the interface definition
  let interfaceDefinition = 'interface MyObject {\n'
  interfaceDefinition += generateInterfaceRec(obj, 1)
  interfaceDefinition += '}'

  console.log(interfaceDefinition)
}

// Example usage
const obj = {
  adult: false,
  backdrop_path: '/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
  created_by: [],
  episode_run_time: [],
  first_air_date: '2013-04-07',
  genres: [
    {
      id: 16,
      name: 'Animation',
    },
    {
      id: 10765,
      name: 'Sci-Fi & Fantasy',
    },
    {
      id: 10759,
      name: 'Action & Adventure',
    },
  ],
  homepage: 'https://shingeki.tv/',
  id: 1429,
  in_production: false,
  languages: ['ja'],
  last_air_date: '2022-04-04',
  last_episode_to_air: {
    id: 3508327,
    name: 'The Dawn of Humanity',
    overview:
      "Regardless of where it all began, Eren commits to his path of destruction during the Scouts' first visit to the Marleyan mainland, leaving Mikasa to wonder if things could've been different.",
    vote_average: 8.7,
    vote_count: 20,
    air_date: '2022-04-04',
    episode_number: 28,
    episode_type: 'standard',
    production_code: '',
    runtime: 23,
    season_number: 4,
    show_id: 1429,
    still_path: '/eu8TEJlYFWIWpPHyYw61JMMyPAB.jpg',
  },
  name: 'Attack on Titan',
  next_episode_to_air: null,
  networks: [
    {
      id: 94,
      logo_path: '/7RNXnyiMbjgqtPAjja13wchcrGI.png',
      name: 'MBS',
      origin_country: 'JP',
    },
    {
      id: 469,
      logo_path: '/3E5bxm9VfOU9LkAX545jtpKAe6Z.png',
      name: 'NHK G',
      origin_country: 'JP',
    },
    {
      id: 614,
      logo_path: '/hSdroyVthq3CynxTIIY7lnS8w1.png',
      name: 'Tokyo MX',
      origin_country: 'JP',
    },
  ],
  number_of_episodes: 87,
  number_of_seasons: 4,
  origin_country: ['JP'],
  original_language: 'ja',
  original_name: '進撃の巨人',
  overview:
    'Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest Titans. Flash forward to the present and the city has not seen a Titan in over 100 years. Teenage boy Eren and his foster sister Mikasa witness something horrific as the city walls are destroyed by a Colossal Titan that appears out of thin air. As the smaller Titans flood the city, the two kids watch in horror as their mother is eaten alive. Eren vows that he will murder every single Titan and take revenge for all of mankind.',
  popularity: 127.25,
  poster_path: '/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
  production_companies: [
    {
      id: 529,
      logo_path: '/rwB6w2aPENQbx756pBWSw44Ouk.png',
      name: 'Production I.G',
      origin_country: 'JP',
    },
    {
      id: 21444,
      logo_path: '/wSejGn3lAZdQ5muByxvzigwyDY6.png',
      name: 'MAPPA',
      origin_country: 'JP',
    },
    {
      id: 31058,
      logo_path: '/1vwZPG0zMVRvThCY8Lljh0ppxQo.png',
      name: 'WIT STUDIO',
      origin_country: 'JP',
    },
    {
      id: 9148,
      logo_path: '/rtW3NadfF4kR5mTW00ahiFxw6k7.png',
      name: 'Pony Canyon',
      origin_country: 'JP',
    },
    {
      id: 151984,
      logo_path: null,
      name: 'Techno Sound',
      origin_country: 'JP',
    },
    {
      id: 59118,
      logo_path: '/9nTCEBgGaaI5swkv8gy2vny0Mb5.png',
      name: 'Kodansha',
      origin_country: 'JP',
    },
    {
      id: 1778,
      logo_path: '/b5rT6VbYza3LyfltCmz1OcqzWJM.png',
      name: 'dentsu',
      origin_country: 'JP',
    },
    {
      id: 3363,
      logo_path: '/sj3vD7n63bTCih7bcf6GnWvRf1Q.png',
      name: 'MBS',
      origin_country: 'JP',
    },
    {
      id: 170262,
      logo_path: null,
      name: 'Pony Canyon Enterprise',
      origin_country: 'JP',
    },
  ],
  production_countries: [
    {
      iso_3166_1: 'JP',
      name: 'Japan',
    },
  ],
  seasons: [
    {
      air_date: '2013-07-07',
      episode_count: 37,
      id: 3789,
      name: 'Specials',
      overview: '',
      poster_path: '/no3dkH44ywREi0la8tw4TnA1GxN.jpg',
      season_number: 0,
      vote_average: 0,
    },
    {
      air_date: '2013-04-07',
      episode_count: 25,
      id: 3788,
      name: 'Season 1',
      overview:
        'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.',
      poster_path: '/gC78bsXhdU2PwT3FkLcn8R5YcHb.jpg',
      season_number: 1,
      vote_average: 8.1,
    },
    {
      air_date: '2017-04-01',
      episode_count: 12,
      id: 84756,
      name: 'Season 2',
      overview:
        'Eren Yeager and others of the 104th Training Corps have just begun to become full members of the Survey Corps. As they ready themselves to face the Titans once again, their preparations are interrupted by the invasion of Wall Rose—but all is not as it seems as more mysteries are unraveled. As the Survey Corps races to save the wall, they uncover more about the invading Titans and the dark secrets of their own members.',
      poster_path: '/2fhK0wbFixskgRyuq6YvaMn75et.jpg',
      season_number: 2,
      vote_average: 8.3,
    },
    {
      air_date: '2018-07-23',
      episode_count: 22,
      id: 98013,
      name: 'Season 3',
      overview:
        "Eren and his companions in the 104th are assigned to the newly-formed Levi Squad, whose assignment is to keep Eren and Historia safe given Eren's newly-discovered power and Historia's knowledge and pedigree. Levi and Erwin have good reason to be concerned, because the priest of the Church that Hange had hidden away was found tortured to death, making it clear that the Military Police are involved with the cover-up. Things get more harrowing when the MPs make a move on Erwin and the Levi Squad narrowly avoids capture. Eren is also having problems with his Titan transformation, and a deadly killer has been hired to secure Eren and Historia, one Levi knows all too well from his youth.\n\nThen, hoping to retake Wall Maria and find the answers humanity seeks in Grisha's basement, Eren, Mikasa, Armin and the rest of the Survey Corps return to the town where everything began: Shiganshina.",
      poster_path: '/2F3sYFneiKcrwboD0bOqb29cGET.jpg',
      season_number: 3,
      vote_average: 8.4,
    },
    {
      air_date: '2020-12-07',
      episode_count: 28,
      id: 126952,
      name: 'The Final Season',
      overview:
        "The truth revealed through the memories of Grisha's journals shakes all of Eren's deepest beliefs. There is no rugged but free land beyond the walls. There is a whole other world, equally full of oppression and war. Suddenly, the ambitions that have animated the Survey Corps for generations seem small and naive. What is there left to fight for?",
      poster_path: '/iUsrnXfubNwhM8FRNEmzXmLfxB2.jpg',
      season_number: 4,
      vote_average: 8.4,
    },
  ],
  spoken_languages: [
    {
      english_name: 'Japanese',
      iso_639_1: 'ja',
      name: '日本語',
    },
  ],
  status: 'Ended',
  tagline: '',
  type: 'Scripted',
  vote_average: 8.664,
  vote_count: 5899,
}
generateInterface(obj)
// const obj = {
//   adult: false,
//   backdrop_path: '/nTPFkLUARmo1bYHfkfdNpRKgEOs.jpg',
//   belongs_to_collection: null,
//   budget: 25000000,
//   genres: [
//     {
//       id: 35,
//       name: 'Comedy',
//     },
//     {
//       id: 10749,
//       name: 'Romance',
//     },
//   ],
//   homepage: 'https://www.anyonebutyou.movie',
//   id: 1072790,
//   imdb_id: 'tt26047818',
//   original_language: 'en',
//   original_title: 'Anyone But You',
//   overview:
//     'After an amazing first date, Bea and Bens fiery attraction turns ice cold — until they find themselves unexpectedly reunited at a destination wedding in Australia. So they do what any two mature adults would do: pretend to be a couple.',
//   popularity: 604.475,
//   poster_path: '/yRt7MGBElkLQOYRvLTT1b3B1rcp.jpg',
//   production_companies: [
//     {
//       id: 7291,
//       logo_path: '/eo8YnSO7wpUHVEprnMDOUcalhFD.png',
//       name: 'Olive Bridge Entertainment',
//       origin_country: 'US',
//     },
//     {
//       id: 184023,
//       logo_path: '/fpMQBF9krWUG3nPN4qV6d1ibkFM.png',
//       name: 'Fifty-Fifty Films',
//       origin_country: 'US',
//     },
//     {
//       id: 105052,
//       logo_path: null,
//       name: 'Roth-Kirschenbaum Films',
//       origin_country: 'US',
//     },
//     {
//       id: 124283,
//       logo_path: '/s0pkrY33hW7VQgnqzhLhbIVg0F4.png',
//       name: 'SK Global Entertainment',
//       origin_country: 'US',
//     },
//     {
//       id: 5,
//       logo_path: '/71BqEFAF4V3qjjMPCpLuyJFB9A.png',
//       name: 'Columbia Pictures',
//       origin_country: 'US',
//     },
//     {
//       id: 22213,
//       logo_path: '/qx9K6bFWJupwde0xQDwOvXkOaL8.png',
//       name: 'TSG Entertainment',
//       origin_country: 'US',
//     },
//     {
//       id: 144037,
//       logo_path: null,
//       name: 'Australian Government',
//       origin_country: '',
//     },
//   ],
//   production_countries: [
//     {
//       iso_3166_1: 'AU',
//       name: 'Australia',
//     },
//     {
//       iso_3166_1: 'US',
//       name: 'United States of America',
//     },
//   ],
//   release_date: '2023-12-21',
//   revenue: 189321912,
//   runtime: 104,
//   spoken_languages: [
//     {
//       english_name: 'English',
//       iso_639_1: 'en',
//       name: 'English',
//     },
//   ],
//   status: 'Released',
//   tagline: 'They only look like the perfect couple.',
//   title: 'Anyone But You',
//   video: false,
//   vote_average: 6.939,
//   vote_count: 484,
// }

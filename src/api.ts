const API_KEY = "b333bb592651d5a2a811d794f7b2e393";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetPopularMovies {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function GetPopularMovies() {
  return fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetNowPlayingMovies() {
  return fetch(
    // `${BASE_URL}/movie/latest?api_key=${API_KEY}&language=en-US&page=1&region=kr`
    "https://api.themoviedb.org/3/movie/now_playing?api_key=b333bb592651d5a2a811d794f7b2e393&language=en-US"
  ).then((response) => response.json());
}

export function GetTopRatedMovies() {
  return fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetUpcomingMovies() {
  return fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

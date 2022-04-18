const API_KEY = "b333bb592651d5a2a811d794f7b2e393";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
}

export interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
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
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=kr`
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

export function GetPopularTvs() {
  return fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetTopRatedTvs() {
  return fetch(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetAiringTodayTvs() {
  return fetch(
    `${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetOnTheAirTvs() {
  return fetch(
    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1&region=kr`
  ).then((response) => response.json());
}

export function GetSearchedMovies(search: string | null) {
  return fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=1`
  ).then((response) => response.json());
}

export function GetSearchedTvs(search: string | null) {
  return fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&query=${search}&page=1`
  ).then((response) => response.json());
}

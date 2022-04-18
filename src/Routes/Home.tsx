import { match } from "assert";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetPopularMovies, IMovie } from "../api";
import NowPlayingMovie from "../Components/NowPlayingMovie";
import PopularMovie from "../Components/PopularMovie";
import TopRatedMovie from "../Components/TopRatedMovie";
import UpcomingMovie from "../Components/UpcomingMovie";
import { makeMovieImageUrl } from "../utils";

const Background = styled.div<{ bgUrl: string }>`
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgUrl});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Introduction = styled.section`
  padding: 0px 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 500;
`;

const Overview = styled.p`
  width: 60%;
  max-width: 900px;
  font-size: 24px;
  line-height: 1.25em;
`;

const SliderContainer = styled.div`
  /* top: -200px; */
`;

function Home() {
  const sliderOffset = 6;
  const { data, isLoading } = useQuery(["Movie", "Popular"], GetPopularMovies);
  const movieNavigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const detailMovie =
    movieMatch?.params.movieId &&
    data?.results.find(
      (movie: IMovie) => String(movie.id) === movieMatch?.params.movieId
    );
  const [index, setIndex] = useState(0);
  const [isExit, setIsExit] = useState(false);
  const toggleIsExit = () => setIsExit((prev) => !prev);
  const incraseIndex = () => {
    if (data) {
      if (!isExit) {
        toggleIsExit();
        const totalMovies = data.results.length - 1;
        const maxIndex = Math.floor(totalMovies / sliderOffset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const decraseIndex = () => setIndex((prev) => (prev === 0 ? 2 : prev - 1));
  const goMovieDetail = (movieId: number) =>
    movieNavigate(`/movies/${movieId}`);
  const onOverlayClick = () => movieNavigate("/");
  return (
    <>
      <Background
        onClick={incraseIndex}
        bgUrl={makeMovieImageUrl(data?.results[0].backdrop_path || "")}
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <Introduction>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Introduction>
        )}
      </Background>
      <SliderContainer>
        <PopularMovie />
        <TopRatedMovie />
        <NowPlayingMovie />
        <UpcomingMovie />
      </SliderContainer>
    </>
  );
}
export default Home;

import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetNowPlayingMovies, GetPopularMovies, IMovie } from "../api";
import { makeMovieImageUrl } from "../utils";

const SliderTitle = styled.h3`
  margin: 30px 60px;
  font-size: 24px;
  font-weight: 500;
`;

const Slider = styled.div`
  width: 100%;
  margin-bottom: 300px;
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  width: 100%;
  position: absolute;
`;

const PosterCard = styled(motion.div)<{ bgurl: string }>`
  background-image: url(${(props) => props.bgurl});
  background-size: cover;
  display: flex;
  align-items: flex-end;
  background-position: center center;
  /* position: relative; */
  height: 200px;
  &: first-child {
    transform-origin: center left;
  }
  &: last-child {
    transform-origin: center right;
  } ;
`;

const Info = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  height: 40px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  /* bottom: 0px; */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
`;

const Detail = styled(motion.div)<{ scroll: number; margin: number }>`
  width: 500px;
  height: 700px;
  background-color: grey;
  position: absolute;
  top: ${(props) => props.scroll + props.margin}px;
  left: 0;
  right: 0;
  /* bottom: 0; */
  margin: auto;
  z-index: 1000;
  border-radius: 30px;
  overflow: hidden;
`;

const DetailBackdim = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const DetailImg = styled.img`
  width: 100%;
  height: 350px;
  filter: brightness(40%);
  object-fit: cover;
`;

const DetailIntroduction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 0px 20px;
  position: relative;
  top: -66px;
  h3 {
    font-size: 36px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.5em;
  }
  p {
    font-size: 16px;
    font-weight: 300;
    /* height: 105px; */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    line-height: 1.25em;
  }
`;

const sliderVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const posterVariants = {
  default: {
    scale: 1,
    filter: "brightness(60%)",
  },
  hover: {
    scale: 1.3,
    filter: "brightness(100%)",
    zIndex: 100,
    transition: {
      delay: 0.25,
      type: "tween",
    },
  },
};

const infoVariants = {
  default: {
    opacity: 0,
  },
  hover: {
    opacity: 0.9,
    transition: {
      delay: 0.25,
      type: "tween",
    },
  },
};

const NowPlayingMovie = () => {
  const sliderOffset = 6;
  const movieMatch = useMatch(`/movies/now_playing/:movieId`);
  const movieNavigate = useNavigate();
  const { data: nowPlayingData } = useQuery(
    ["movies", "nowPlaying"],
    GetNowPlayingMovies
  );
  const [isExit, setIsExit] = useState(false);
  const [index, setIndex] = useState(0);
  const { scrollY } = useViewportScroll();
  const detailMovie =
    movieMatch?.params.movieId &&
    nowPlayingData?.results.find(
      (movie: IMovie) => String(movie.id) === movieMatch?.params.movieId
    );
  const { data: nowPlayingDetailData } = useQuery(
    ["movies", "nowPlaying"],
    GetNowPlayingMovies
  );
  const incraseIndex = () => {
    if (nowPlayingData) {
      if (!isExit) {
        toggleIsExit();
        const totalMovies = nowPlayingData.results.length - 1;
        const maxIndex = Math.floor(totalMovies / sliderOffset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const decraseIndex = () => setIndex((prev) => (prev === 0 ? 2 : prev - 1));
  const toggleIsExit = () => setIsExit((prev) => !prev);
  const goMovieDetail = (movieId: number) =>
    movieNavigate(`/movies/now_playing/${movieId}`);
  const onOverlayClick = () => movieNavigate("/");
  return (
    <>
      <SliderTitle onClick={incraseIndex}>Now Playing Movies</SliderTitle>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleIsExit}>
          <Row
            offset={sliderOffset}
            variants={sliderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
            key={index}
          >
            {nowPlayingData?.results
              .slice(1)
              .slice(index * sliderOffset, index * sliderOffset + sliderOffset)
              .map((movie: IMovie) => (
                <PosterCard
                  layoutId={movie.id.toString() + "latest"}
                  onClick={() => goMovieDetail(movie.id)}
                  variants={posterVariants}
                  initial="default"
                  whileHover="hover"
                  key={movie.id}
                  bgurl={makeMovieImageUrl(movie.poster_path, "w500")}
                >
                  <Info variants={infoVariants}>{movie.title}</Info>
                </PosterCard>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {movieMatch ? (
          <>
            <DetailBackdim
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
            <Detail
              margin={Math.ceil((window.innerHeight - 700) / 2)}
              scroll={scrollY.get()}
              layoutId={movieMatch?.params.movieId + "latest"}
            >
              <DetailImg
                src={
                  detailMovie
                    ? makeMovieImageUrl(detailMovie.backdrop_path, "w500")
                    : "/"
                }
              />
              <DetailIntroduction>
                <h3>{detailMovie.title}</h3>
                <p>{detailMovie.overview}</p>
              </DetailIntroduction>
            </Detail>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default NowPlayingMovie;

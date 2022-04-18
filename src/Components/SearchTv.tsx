import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetSearchedMovies, GetSearchedTvs, ITv } from "../api";
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

const Next = styled(motion.div)`
  height: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 50px;
  position: absolute;
  z-index: 10;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Prev = styled(motion.div)`
  height: 200px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 50px;
  position: absolute;
  z-index: 10;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  width: 100%;
  position: absolute;
`;

const PosterCard = styled(motion.div)<{ bgurl: string }>`
  background-color: ${(props) => props.theme.black.veryDark};
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
  background-color: ${(props) => props.theme.black.veryDark};
  position: absolute;
  /* bottom: 0px; */
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
`;

const Detail = styled(motion.div)<{
  scroll: number;
  margin: number;
  height: number;
}>`
  width: 500px;
  height: 700px;
  background-color: ${(props) => props.theme.black.veryDark};
  position: absolute;
  top: ${(props) => props.scroll + props.margin - props.height}px;

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
  hidden: (direction: boolean) => {
    return {
      x: direction ? window.outerWidth + 10 : -(window.outerWidth + 10),
    };
  },
  visible: {
    x: 0,
  },
  exit: (direction: boolean) => {
    return {
      x: direction ? -(window.outerWidth + 10) : window.outerWidth + 10,
    };
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

const SearchTv = ({ search }: any) => {
  console.log(search);
  const sliderOffset = 6;
  const SearchMatch = useMatch(`/search/:movieId`);
  const movieNavigate = useNavigate();
  const { data: searchMovieData, isLoading: moviesLoading } = useQuery(
    ["search", "tv", `${search}`],
    () => GetSearchedTvs(search)
  );
  // console.log(searchMovieData, search);
  console.log(search, SearchMatch);
  const [isExit, setIsExit] = useState(false);
  const [index, setIndex] = useState(0);
  const { scrollY } = useViewportScroll();
  const detailMovie =
    SearchMatch?.params.movieId &&
    searchMovieData?.results.find(
      (movie: ITv) => String(movie.id) === SearchMatch?.params.movieId
    );
  const [direction, setDirection] = useState(true);
  console.log(search, searchMovieData);
  const incraseIndex = () => {
    setDirection(true);
    if (searchMovieData) {
      if (!isExit) {
        toggleIsExit();
        const totalMovies = searchMovieData.results.length;
        const maxIndex = Math.ceil(totalMovies / sliderOffset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const decraseIndex = () => {
    setDirection(false);
    if (searchMovieData) {
      if (!isExit) {
        toggleIsExit();
        const totalMovies = searchMovieData.results.length;
        const maxIndex = Math.ceil(totalMovies / sliderOffset) - 1;
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };
  const toggleIsExit = () => setIsExit((prev) => !prev);
  const goMovieDetail = (movieId: number) =>
    movieNavigate(`/search/${movieId}`);
  const onOverlayClick = () => movieNavigate(`/search?search=${search}`);
  let a = [];
  let b = [];
  if (detailMovie) {
    a = new Array(Math.floor(Math.round(detailMovie.vote_average) / 2)).fill(0);
    b = new Array(Math.round(detailMovie.vote_average) % 2).fill(0);
  }

  return (
    <>
      <SliderTitle onClick={incraseIndex}>
        {searchMovieData?.results.length} Movies related with '{search}'
      </SliderTitle>
      <Slider>
        <Prev onClick={decraseIndex}>
          <i className="ri-arrow-left-s-line ri-3x"></i>
        </Prev>
        <Next onClick={incraseIndex}>
          <i className="ri-arrow-right-s-line ri-3x"></i>
        </Next>
        <AnimatePresence
          custom={direction}
          initial={false}
          onExitComplete={toggleIsExit}
        >
          <Row
            offset={sliderOffset}
            variants={sliderVariants}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
            key={index}
          >
            {searchMovieData?.results
              .slice(index * sliderOffset, index * sliderOffset + sliderOffset)
              .map((movie: ITv) => (
                <PosterCard
                  layoutId={movie.id.toString() + "popular"}
                  // onClick={() => goMovieDetail(movie.id)}
                  variants={posterVariants}
                  initial="default"
                  whileHover="hover"
                  key={movie.id}
                  bgurl={makeMovieImageUrl(movie.poster_path, "w500")}
                >
                  <Info variants={infoVariants}>{movie.name}</Info>
                </PosterCard>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {SearchMatch ? (
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
              height={window.innerHeight - 200}
              layoutId={SearchMatch?.params.movieId + "popular"}
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
                <p>release date: {detailMovie.release_date}</p>
                <div>
                  rate:
                  {a.map((item, index) => (
                    <i key={index} className="ri-star-fill"></i>
                  ))}
                  {b.map((item, index) => (
                    <i key={index} className="ri-star-half-fill"></i>
                  ))}
                  ({detailMovie.vote_average}, Total:
                  {detailMovie.vote_count} votes)
                </div>
              </DetailIntroduction>
            </Detail>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default SearchTv;

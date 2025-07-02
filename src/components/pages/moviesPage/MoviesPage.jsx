import React from 'react';
import useMoviesQuery from '../../../hooks/useMoviesQuery';
import BearCarousel, { BearSlideImage } from 'bear-react-carousel';
import { Box, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorMessage from '../../ui/errorMessage/ErrorMessage';
import MoviesPageSkeleton from '../../ui/moviesPageSkeleton/MoviesPageSkeleton';

const MoviesPage = () => {
  const { isLoading, hasError, responsePopular, responseBest, responseFilms, responseSerials, responseCartoons } =
    useMoviesQuery();

  if (isLoading) return <MoviesPageSkeleton />;

  if (hasError) return <ErrorMessage />;

  const serializeDataForSlider = (data) =>
    data.map((row) => (
      <RouterLink key={row.id} to={`/movie/${row.kinopoiskId}`}>
        <BearSlideImage imageUrl={row.posterUrlPreview} />
      </RouterLink>
    ));

  const sliderArr = [
    {
      title: 'Популярные фильмы',
      url: '/popular',
      data: serializeDataForSlider(responsePopular.data.items),
    },
    {
      title: 'Лучшие фильмы',
      url: '/top-250',
      data: serializeDataForSlider(responseBest.data.items),
    },
    {
      title: 'Фильмы',
      url: '/films',
      data: serializeDataForSlider(responseFilms.data.items),
    },
    {
      title: 'Сериалы',
      url: '/serials',
      data: serializeDataForSlider(responseSerials.data.items),
    },
    {
      title: 'Мультфильмы',
      url: '/cartoons',
      data: serializeDataForSlider(responseCartoons.data.items),
    },
  ];

  return (
    <Box sx={{ px: { xs: 0.5, sm: 1 } }}>
      {sliderArr.map((slider) => (
        <Stack key={slider.url} sx={{ mb: { xs: 1, sm: 2 } }}>
          <Link
            component={RouterLink}
            to={slider.url}
            variant="h6"
            sx={{ mt: { xs: 1, sm: 2 }, mb: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.9rem', sm: '1.2rem' } }}
          >
            {slider.title}
          </Link>
          <BearCarousel
            data={slider.data}
            slidesPerView={1}
            slidesPerGroup={2}
            isEnableNavButton
            isEnableLoop
            autoPlayTime={5000}
            isEnableAutoPlay={false}
            spaceBetween={{ xs: 8, sm: 16 }}
            breakpoints={{
              375: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 8,
                isEnableAutoPlay: false,
              },
              768: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 16,
              },
            }}
          />
        </Stack>
      ))}
    </Box>
  );
};

export default MoviesPage;
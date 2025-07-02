import React, { useEffect, useState } from 'react';
import { useGetFilmsQuery, useGetGenresAndCountriesQuery } from '../../../services/kinopoiskApi';
import { MOVIE_LISTS } from '../../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import MoviesList from '../../ui/moviesList/MoviesList';
import { ArrowBack } from '@mui/icons-material';
import ErrorMessage from '../../ui/errorMessage/ErrorMessage';
import MoviesListTopSkeleton from '../../ui/moviesListTopSkeleton/MoviesListMainSkeleton';
import { useSelector } from 'react-redux';
import SelectMovies from '../../ui/selectMovies/SelectMovies';

export default function MoviesListMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentQuery = useSelector((state) => state.currentQuery) || {
    countries: '',
    order: 'NUM_VOTE',
    year: '',
    genreId: '',
  };
  const { countries = '', order = 'NUM_VOTE', year = '', genreId = '' } = currentQuery;

  const [page, setPage] = useState(1);

  const movieType = MOVIE_LISTS.find((el) => el.url === location.pathname);

  const queryParams = {
    type: movieType?.value || 'FILM',
    countries: countries || '',
    order: order || 'NUM_VOTE',
    year: year || '',
    genreId: movieType?.url === '/cartoons' && !genreId ? '18' : genreId || '',
    page,
  };

  const isValidQuery = queryParams.type && queryParams.page > 0;

  const {
    data: filmsData,
    error: filmsError,
    isLoading: filmsIsLoading,
    isFetching,
  } = useGetFilmsQuery(queryParams, { skip: !isValidQuery || !movieType });

  const { data: filtersData, error: filtersError, isLoading: filtersIsLoading } = useGetGenresAndCountriesQuery();

  useEffect(() => {
    setPage(1); 
  }, [countries, order, year, genreId, location.pathname]);

  if (filmsError || filtersError) {
    return <ErrorMessage message={filmsError?.data?.message || filtersError?.data?.message || 'Произошла ошибка'} />;
  }

  if (filmsIsLoading || filtersIsLoading || isFetching) {
    return <MoviesListTopSkeleton />;
  }

  if (!movieType) {
    return <ErrorMessage message="Страница не найдена" />;
  }

  return (
    <Box sx={{ px: isMobile ? 1 : 3, py: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: 'auto', mr: 1 }}
        />
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 600 }}>
          {movieType.title}
        </Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <SelectMovies
          countriesList={filtersData?.countries || []}
          genresList={filtersData?.genres || []}
          countries={countries}
          order={order}
          year={year}
          genreId={genreId}
          isMobile={isMobile}
        />
      </Box>

      <MoviesList
        movies={filmsData?.items || []}
        totalPages={filmsData?.totalPages || 1}
        page={page}
        setPage={setPage}
        isMobile={isMobile}
      />
    </Box>
  );
}
import React, { useEffect, useState } from 'react';
import { useGetFilmsTopQuery } from '../../../services/kinopoiskApi';
import { TOP_LISTS } from '../../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import MoviesList from '../../ui/moviesList/MoviesList';
import { ArrowBack } from '@mui/icons-material';
import ErrorMessage from '../../ui/errorMessage/ErrorMessage';
import MoviesListTopSkeleton from '../../ui/moviesListTopSkeleton/MoviesListMainSkeleton';

export default function MoviesListTop() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(1);

  const topType = TOP_LISTS.find((el) => el.url === location.pathname);

  const queryParams = {
    type: topType?.value || 'TOP_POPULAR_ALL',
    page,
  };

  const isValidQuery = queryParams.type && queryParams.page > 0;

  const {
    data: filmsData,
    error: filmsError,
    isLoading: filmsIsLoading,
    isFetching,
  } = useGetFilmsTopQuery(queryParams, { skip: !isValidQuery || !topType });

  useEffect(() => {
    setPage(1);
  }, [location.pathname]);

  if (filmsError) {
    return <ErrorMessage message={filmsError?.data?.message || 'Произошла ошибка'} />;
  }

  if (filmsIsLoading || isFetching) {
    return <MoviesListTopSkeleton />;
  }

  if (!topType) {
    return <ErrorMessage message="Страница не найдена" />;
  }

  return (
    <Box sx={{ px: { xs: 0.5, sm: 1 }, py: { xs: 0.5, sm: 1 } }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ mb: { xs: 0.5, sm: 1 }, px: { xs: 0.5, sm: 0 } }}
      >
        <Button
          startIcon={<ArrowBack fontSize={isMobile ? 'small' : 'medium'} />}
          onClick={() => navigate(-1)}
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: 'auto', mr: { xs: 0.5, sm: 1 }, py: { xs: 0.5 } }}
          variant="text"
        >
          Назад
        </Button>
        <Typography
          variant={isMobile ? 'h6' : 'h4'}
          sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1.2rem', md: '1.5rem' } }}
        >
          {topType.title}
        </Typography>
      </Stack>

      <Box sx={{ overflowX: 'auto', pb: { xs: 1, sm: 1.5 } }}>
        <MoviesList
          movies={filmsData?.items || []}
          totalPages={filmsData?.totalPages || 1}
          page={page}
          setPage={setPage}
          isMobile={isMobile}
        />
      </Box>
    </Box>
  );
}
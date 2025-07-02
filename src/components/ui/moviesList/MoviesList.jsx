import { Pagination, Stack } from '@mui/material';
import React from 'react';
import MovieCard from '../movieCard/MovieCard';

const MoviesList = ({ movies, totalPages, page, setPage, isMobile }) => {
  const displayedMovies = movies.slice(0, 12);

  const rows = isMobile
    ? [displayedMovies.slice(0, 6), displayedMovies.slice(6, 12)]
    : [
        displayedMovies.slice(0, 4),
        displayedMovies.slice(4, 8),
        displayedMovies.slice(8, 12),
      ];

  return (
    <>
      <Stack gap={{ xs: 0.5, sm: 1, md: 2 }} sx={{ px: { xs: 0.5, sm: 1 } }}>
        {rows.map((row, rowIndex) => (
          <Stack
            key={rowIndex}
            direction="row"
            gap={{ xs: 0.5, sm: 1 }}
            justifyContent="space-between"
            sx={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}
          >
            {row.map((movie) => (
              <div key={movie.kinopoiskId} style={{ width: isMobile ? '48%' : '24%' }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Stack>
        ))}
      </Stack>

      <Pagination
        count={totalPages}
        color="primary"
        variant="outlined"
        shape="rounded"
        size={isMobile ? 'small' : 'medium'}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 } }}
      />
    </>
  );
};

export default MoviesList;
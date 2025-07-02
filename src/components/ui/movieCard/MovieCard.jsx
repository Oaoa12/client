import { Box, Link, Rating, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styles from './MovieCard.module.scss';

const MovieCard = ({ movie }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Stack
      className={styles.card}
      sx={{ width: { xs: '100%', sm: '100%' }, mx: 'auto' }}
    >
      <RouterLink to={`/movie/${movie.kinopoiskId}`}>
        <img
          src={movie.posterUrlPreview}
          alt={movie.nameRu || movie.nameEn}
          className={styles.img}
          style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
        />
      </RouterLink>
      <Link
        component={RouterLink}
        to={`/movie/${movie.kinopoiskId}`}
        textAlign="center"
        sx={{
          width: '100%',
          mt: { xs: 0.5, sm: 0.75 },
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          lineHeight: 1.2,
        }}
      >
        {movie.nameRu || movie.nameEn || 'Название отсутствует'}
      </Link>

      {movie.ratingKinopoisk && (
        <Stack alignItems="center" sx={{ mt: { xs: 0.5, sm: 0.75 } }}>
          <Tooltip title={`${movie.ratingKinopoisk} / 10`}>
            <Box>
              <Rating
                name="read-only"
                value={movie.ratingKinopoisk / 2}
                readOnly
                precision={0.1}
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
};

export default MovieCard;
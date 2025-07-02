import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'https://server-ds6n.onrender.com';

export const likesApi = createApi({
  reducerPath: 'likesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/likes`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLikes: builder.query({
      query: (movieId) => `/${movieId}`,
      providesTags: ['Likes'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error?.status === 401) {
            await handleTokenRefresh(dispatch);
            dispatch(likesApi.util.invalidateTags(['Likes']));
          }
        }
      },
    }),
    setLike: builder.mutation({
      query: (movieId) => ({
        url: '/like',
        method: 'POST',
        body: { movieId },
      }),
      invalidatesTags: ['Likes'],
    }),
    setDislike: builder.mutation({
      query: (movieId) => ({
        url: '/dislike',
        method: 'POST',
        body: { movieId },
      }),
      invalidatesTags: ['Likes'],
    }),
  }),
});

async function handleTokenRefresh(dispatch) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        refreshToken: localStorage.getItem('refreshToken') 
      }),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}

export const { 
  useGetLikesQuery, 
  useSetLikeMutation, 
  useSetDislikeMutation 
} = likesApi;
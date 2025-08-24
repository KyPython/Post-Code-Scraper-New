import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { JobStatus, RequestStatus } from '../types/enums';
import { 
  AppState, 
  JobData, 
  DatabaseStats, 
  ScrapeResponse, 
  JobStatusResponse, 
  DatabaseStatsResponse, 
  InfoRequestResponse 
} from '../types/schema';

// Initial state
const initialState: AppState = {
  currentJob: null,
  databaseStats: {
    totalPostcodes: 0,
    recentEntries: [],
    regionCounts: {}
  },
  requestStatus: RequestStatus.IDLE,
  states: []
};

// App slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentJob: (state, action: PayloadAction<JobData | null>) => {
      state.currentJob = action.payload;
    },
    updateDatabaseStats: (state, action: PayloadAction<DatabaseStats>) => {
      state.databaseStats = action.payload;
    },
    setRequestStatus: (state, action: PayloadAction<RequestStatus>) => {
      state.requestStatus = action.payload;
    },
    setStates: (state, action: PayloadAction<string[]>) => {
      state.states = action.payload;
    }
  }
});

// API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Job', 'DatabaseStats'],
  endpoints: (builder) => ({
    startScraping: builder.mutation<ScrapeResponse, { state: string; city?: string }>({
      query: (data) => ({
        url: 'scrape',
        method: 'POST',
        body: new URLSearchParams({
          state: data.state,
          ...(data.city && { city: data.city })
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
      invalidatesTags: ['DatabaseStats'],
    }),
    getJobStatus: builder.query<JobStatusResponse, string>({
      query: (jobId) => `job/${jobId}`,
      providesTags: (result, error, jobId) => [{ type: 'Job', id: jobId }],
    }),
    getDatabaseStats: builder.query<DatabaseStatsResponse, void>({
      query: () => 'database-stats',
      providesTags: ['DatabaseStats'],
    }),
    requestInfo: builder.mutation<InfoRequestResponse, { name?: string; email?: string; message?: string }>({
      query: (data) => ({
        url: 'request-info',
        method: 'POST',
        body: new URLSearchParams(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    }),
  }),
});

// Export actions and selectors
export const { setCurrentJob, updateDatabaseStats, setRequestStatus, setStates } = appSlice.actions;

// Export API hooks
export const {
  useStartScrapingMutation,
  useGetJobStatusQuery,
  useGetDatabaseStatsQuery,
  useRequestInfoMutation,
} = api;

// Configure store
export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
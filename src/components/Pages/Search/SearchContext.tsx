import React, { useReducer } from 'react';
import { SearchItem, ServerResponse } from '../Types';
import requestData from '../../../utils/requestData';
import { Dictionary } from '../../../common/Types';

const START = 'START' as const;
const LOADED = 'LOADED' as const;

export const start = () => ({ type: START });
export const loaded = (response: ServerResponse) => ({
  type: LOADED,
  response,
});
type SearchAction = ReturnType<typeof start> | ReturnType<typeof loaded>;

interface SearchState {
  loading: boolean;
  more: boolean;
  error: boolean;
  data: SearchItem[];
  token: string | null;
  load: ((query: string | null) => void) | undefined;
}
const initialState: SearchState = {
  loading: false,
  more: true,
  error: false,
  data: [],
  token: null,
  load: undefined,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case START:
      return { ...state, loading: true };
    case LOADED: {
      const { result } = action.response;
      const newData: SearchItem[] = result.items ? result.items : [];
      const token =
        result.nextPageToken !== undefined ? result.nextPageToken : null;
      return {
        ...state,
        loading: false,
        data: [...state.data, ...newData],
        token,
        more: token !== null,
      };
    }
    default:
      throw new Error('Unknown action');
  }
}

const SearchContext = React.createContext<SearchState>(initialState);

interface SearchProviderProps {
  children?: React.ReactNode;
}
export const SearchProvider = (props: SearchProviderProps) => {
  const [searchState, dispatch] = useReducer(searchReducer, initialState);
  const { children } = props;
  let q: string | null = null;

  const load = (query: string | null) => {
    if (q == null) q = query;
    dispatch(start());

    const params: Dictionary<string> = {
      q: q || '',
    };
    if (searchState.token !== null) params.token = searchState.token;

    requestData<ServerResponse>('search.php', params)
      .then((response) => {
        dispatch(loaded(response.data));
      })
      .catch((error) => {
        console.log(error);
        searchState.error = true;
      });
  };
  searchState.load = load;

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;

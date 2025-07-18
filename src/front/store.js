export const initialStore = () => {
  return {
    user: {},
    sesion: false,
    favorites: [],
    searchResults: [],
    haveResults: true,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...store,
        user: action.payload,
      };

    case "SET_SESSION":
      return {
        ...store,
        sesion: action.payload,
      };

    case "handleFavorites":
      return {
        ...store,
        favorites: action.payload,
      };
    case "SET_SEARCH_RESULTS":
      return {
        ...store,
        searchResults: action.payload,
      };

    case "SET_HAVE_RESULTS":
      return {
        ...store,
        haveResults: action.payload,
      };

    default:
      throw Error("Unknown action.");
  }
}

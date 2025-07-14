export const initialStore = () => {
  return {
    user: {},
    sesion: false,
    favorites: [], // Nuevo estado para favoritos
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
        favorites: action.payload, // Actualiza la lista completa de favoritos
      };

    default:
      throw Error("Unknown action.");
  }
}

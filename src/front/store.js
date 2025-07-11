export const initialStore = () => {
  return {
    user: {},
    sesion: false,
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

    default:
      throw Error("Unknown action.");
  }
}

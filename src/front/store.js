export const initialStore = () => {
  return {
    favorites: [] // Nuevo estado para favoritos
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "handleFavorites":
      return {
        ...store,
        favorites: action.payload // Actualiza la lista completa de favoritos
      };

    default:
      throw Error("Unknown action.");
  }
}
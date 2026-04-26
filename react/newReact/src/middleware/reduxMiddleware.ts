import { fetchCategoriesAsync } from "../store/categorySlice";
import { fetchPaintingsAsync } from "../store/paintingSlice";

export const fetchMiddleware = (store) => (next) => (action) => {
  const state = store.getState();

  if (action.type === "@@INIT") {
    if (state.categories.categories.length === 0) {
      store.dispatch(fetchCategoriesAsync());
    }
    if (state.painting.paintings.length === 0) {
      store.dispatch(fetchPaintingsAsync());
    }
  }

  return next(action);
};

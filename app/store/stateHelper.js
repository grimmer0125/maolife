export function extractCatInfo(state) {

  //    state.routes[1].params.catID;

  let cat = {};
  if (state.listNav.routes.length > 1 && state.listNav.routes[1].params.catID) {
    const catID = state.listNav.routes[1].params.catID;

    if (state.cats && state.cats.hasOwnProperty(catID)) {
      cat = {catID, ...state.cats[catID]};
    }
  }

  return cat;

}

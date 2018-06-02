// 有一個是用react navigation的props傳進來的, not redux state
// 但有另一個是 redux state, currentCat: extractCatInfo(state),
// 官網上面是提到react-navigation跟redux整合要用react-navigation-redux-helpers但看來
// 只用getStateForAction也行 https://github.com/react-navigation/react-navigation/blob/master/examples/ReduxExample/src/reducers/index.js
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

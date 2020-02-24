const mutations = {
  TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
    state.isVerticalNavMenuActive = value;
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val;
  },
  UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
    state.verticalNavMenuItemsMin = val;
  },
  UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
    state.verticalNavMenuWidth = width;
  },
  UPDATE_WINDOW_WIDTH(state, width) {
    state.windowWidth = width;
  },
  UPDATE_WINDOW_SCROLL_Y(state, val) {
    state.scrollY = val;
  }
};

export default mutations;

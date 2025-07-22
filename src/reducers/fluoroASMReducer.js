const initialState = {
  filterEnabled: false,
  diamondEnabled: false,
  filterOffset: 0,
  filterColour: "#f90c0c",
  ledColor: "yellow",
};

export const fluoroASMReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FLUORO_SET_FILTER_ENABLED":
      return {
        ...state,
        filterEnabled: action.payload,
        diamondEnabled: action.payload ? state.diamondEnabled : false,
      };
    case "FLUORO_SET_DIAMOND_ENABLED":
      return { ...state, diamondEnabled: action.payload };
    case "FLUORO_SET_FILTER_OFFSET":
      return { ...state, filterOffset: action.payload };
    case "FLUORO_SET_FILTER_COLOR":
      return { ...state, filterColour: action.payload };
    case "FLUORO_SET_LED_COLOR":
      return { ...state, ledColor: action.payload };
    default:
      return state;
  }
};

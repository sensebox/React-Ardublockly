export const setFilterEnabled = (value) => ({
  type: "FLUORO_SET_FILTER_ENABLED",
  payload: value,
});

export const setDiamondEnabled = (value) => ({
  type: "FLUORO_SET_DIAMOND_ENABLED",
  payload: value,
});

export const setFilterOffset = (value) => ({
  type: "FLUORO_SET_FILTER_OFFSET",
  payload: value,
});

export const setFilterColour = (value) => ({
  type: "FLUORO_SET_FILTER_COLOR",
  payload: value,
});

export const setLedColor = (value) => ({
  type: "FLUORO_SET_LED_COLOR",
  payload: value,
});

const sensors = (state = [], action) => {
  switch (action.type) {
    case "FETCH_SENSORWIKI_SUCCESS":
      return action.payload.sensors;
    default:
      return state;
  }
};

export default sensors;

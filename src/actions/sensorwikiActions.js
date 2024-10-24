import axios from "axios";

const fetchSensorWikiSuccess = (sensors) => ({
  type: "FETCH_SENSORWIKI_SUCCESS",
  payload: { sensors },
});

export const fetchSensors = () => {
  return async (dispatch) => {
    try {
      let sensors = await axios.get("https://api.sensors.wiki/sensors/");
      dispatch(fetchSensorWikiSuccess(sensors.data));
    } catch (e) {
      console.log(e);
    }
  };
};

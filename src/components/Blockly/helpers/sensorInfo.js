import axios from "axios";

const sensorInfo = async (slug) => {
    console.log(slug);
    const { data } = await axios.get(`https://api.sensors.wiki/sensors/sensor/${slug}`);
    console.log(window.localStorage.getItem("locale"));
    if (window.localStorage.getItem("locale")) {
        if (data.description.item.length > 1) {
            for (let i = 0; i < data.description.item.length; i++) {
                if (data.description.item[i].languageCode === window.localStorage.getItem("locale").split("_")[0]) {
                    return data.description.item[i].text;
                }
            }
        } else {
            return data.description.item[0].text;
        }
    }
    else {
        return data.description.item[0].text;
    }
}

export default sensorInfo;
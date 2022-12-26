import axios from "axios"

var getAxiosClient = function (baseUrl, token) {
    let x = axios.create({
        baseURL: baseUrl,
        params: {},
        headers: {
            "Authorization": token
        }
    });
    return x;
}

export const getAxios = getAxiosClient
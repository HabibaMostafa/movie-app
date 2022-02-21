import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const savedToken = sessionStorage.getItem("token");

        // const tokenString = sessionStorage.getItem("token");
        // const userToken = JSON.parse(tokenString);
        // return userToken?.token;

        return savedToken;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {

        sessionStorage.setItem("token", JSON.stringify(userToken));

        const aToken = sessionStorage.getItem("token");

        setToken(aToken);
    };

    const removeToken = () => {
        sessionStorage.removeItem("token");
    };

    

    const getTokenObj = () => {
        const tokenObj = JSON.parse(token.toString());
        return tokenObj;
    }

    return {
        setToken: saveToken,
        removeToken: removeToken,
        token,
        getToken: getToken,
        getTokenObj,
    };
}

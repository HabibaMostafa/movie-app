import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        const tokenString = sessionStorage.getItem("token");
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {

        // might not need to stringigy
        sessionStorage.setItem("token", JSON.stringify(userToken));

        const aToken = sessionStorage.getItem("token");

        console.log(aToken);

        setToken(aToken);
    };

    const removeToken = () => {
        sessionStorage.removeItem("token");
    };

    return {
        setToken: saveToken,
        removeToken: removeToken,
        token,
    };
}

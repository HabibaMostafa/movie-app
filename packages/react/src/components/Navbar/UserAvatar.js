import React from "react";
import axios from "axios";
import "./UserAvatar.css";

let currentAvatar = "";

class UserAvatar extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = { fetchedAvatar: false };
    }

    componentDidMount() {
        axios.get(`/avatars/${this.props.userId}`).then((response) => {
            // server converted this back to b64
            currentAvatar = response.data;

            this.setState({ fetchedAvatar: true });
        });
    }

    render() {
        return this.state.fetchedAvatar ? (
            <div>
                <div className="circleCrop">
                    <img
                        className="userAvatar"
                        src={currentAvatar}
                        height="32"
                    ></img>
                </div>
                <div className="spacer"></div>
            </div>
        ) : (
            <div className="hidden"></div>
        );
    }
}

export default UserAvatar;

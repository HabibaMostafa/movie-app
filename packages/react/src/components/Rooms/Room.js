import React from "react";
import axios from "axios";
import "./Drawer.css";

class Room extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
    }

    componentDidMount() {

        // get list of rooms

    }
    render() {
        return <div className="room-container">{this.props._id}</div>;
    }
}

export default Room;

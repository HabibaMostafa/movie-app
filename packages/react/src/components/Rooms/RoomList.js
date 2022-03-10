import React from "react";
import axios from "axios";
import "./Drawer.css";

class RoomList extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
    }

    componentDidMount() {}
    render() {
        return (
            <div className="roomlist-container">
                {/* create new room? */}
                {/*  */}
                {this.props._id}
            </div>
        );
    }
}

export default RoomList;

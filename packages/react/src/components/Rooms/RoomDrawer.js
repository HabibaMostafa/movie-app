import React from "react";
import axios from "axios";
import "./Drawer.css";


class RoomDrawer extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        
        super(props);
        this.props = props;
    }


    render() {
        return <div className="drawer-container"></div>;
    }
}

export default RoomDrawer;

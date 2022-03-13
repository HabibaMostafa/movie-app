import React from "react";
import axios from "axios";

import MovieListElement from "../../Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";


class RoomMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
    }

    render() {
        if (true) {
            return (
                <div>
                    <p>Room Matches</p>

                    <p>roomId: {this.props.roomId}</p>
                    <p>user: Id {this.props.userId}</p>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
export default RoomMatches;

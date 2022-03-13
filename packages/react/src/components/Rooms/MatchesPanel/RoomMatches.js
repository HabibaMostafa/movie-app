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
        this.state = { matches: [], fetchedData: false };
    }

    componentDidMount() {
        axios
            .get(`/room-matches?roomId=${this.props.roomId}`)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ matches: result.data });
                }

                this.setState({ fetchedData: true });
            });
    }

    render() {
        if (this.state.matches !== []) {
            if (this.state.matches.length > 0) {
                return (
                    <div>
                        {/* <p>Room Matches</p>

                        <p>roomId: {this.props.roomId}</p>
                        <p>user: Id {this.props.userId}</p> */}

                        <ImageList
                            // sx={{ width: 1900, height: 450 }}
                            cols={6}
                            rowHeight={164}
                        >
                            {this.state.matches.map((value) => (
                                <MovieListElement movieID={value} />
                            ))}
                        </ImageList>
                    </div>
                );
            }

            if (!this.state.fetchedData) {
                return <div>loading...</div>;
            } else {
                return <div>No Matches =(</div>;
            }
        } else {
            return <div>No Matches =(</div>;
        }
    }
}
export default RoomMatches;

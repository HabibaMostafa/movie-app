import React from "react";
import axios from "axios";
import "./FriendMatches.css";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MovieListElement from "../../components/Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

class FriendMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        
        this.props = props;

        this.state = {
            friendName: "",
            friendUsername: "",
            friend: [],
            _id: "",
            matches: [],
            expand: false,
        };
    }
    componentDidMount() {
        // need to have this in a if statement or else it breaks,
        // whhhhhhhhhhhhhhhhhhhhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
        // fight me react.js
        if (this.props.friend !== undefined) {
            this.setState({ friendName: this.props.friend.name });
            this.setState({ friendUsername: this.props.friend.username });
            this.setState({ friend: this.props.friend });
            this.setState({ _id: this.props._id });

            // populate the list of matches here
            const matchQuery = {
                user1: this.props._id,
                user2: this.props.friend.userId,
            };

            axios.post("/matches", matchQuery).then((result) => {
                if (result.status === 200 && result.data.length > 0) {
                    this.setState({ matches: result.data });
                }
            });
        }
    }

    expandHandler = () => {
        this.setState({ expand: !this.state.expand });
    };

    render() {
        // render nothing if there are no matches
        if (
            this.props.friend === undefined ||
            this.state.matches.length === 0
        ) {
            return <div></div>;
        }

        return (
            <div className="friendMatches">
                <div className="sub-heading">
                    <h3 class="match-friend">
                        {this.state.friendUsername} ({this.state.friendName}) -
                        [ {this.state.matches.length} Matches ]
                    </h3>

                    <div className="expand-btn" onClick={this.expandHandler}>
                        {this.state.expand ? (
                            <ExpandLessIcon
                                fontSize="large"
                                sx={{ fill: "goldenrod" }}
                            />
                        ) : (
                            <ExpandMoreIcon
                                fontSize="large"
                                sx={{ fill: "goldenrod" }}
                            />
                        )}
                    </div>
                </div>

                {this.state.expand ? (
                    <div className="matches-movies">
                        <ImageList
                            sx={{ width: 1280, height: 500 }}
                            cols={6}
                            rowHeight={164}
                        >
                            {this.state.matches.map((value) => (
                                <MovieListElement movieID={value.movieID} />
                            ))}
                        </ImageList>
                    </div>
                ) : (
                    <div className="matches-movies"></div>
                )}
            </div>
        );
    }
}

export default FriendMatches;

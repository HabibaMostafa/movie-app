import React from "react";
import axios from "axios";

import MovieListElement from "../../components/Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";

import './UserPageData.css'

//props: likes = []

class UserLikes extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;

        this.state = {};
    }
    componentDidMount() {}

    render() {
  
        return (
            <div>
                <div className="vote-section">
                    {this.props.likes.filter((element) => element.mustWatch)
                        .length > 0 ? (
                        <div>
                            <div className="must-watch-votes">
                                <h4 className="title">
                                    Must Watch Movies 
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button 
                                        id="like-button"
                                    >
                                    {
                                        this.props.likes.filter(
                                            (element) => element.mustWatch
                                        ).length
                                    }
                                    </Button>
                                </h4>
                                <ImageList
                                    sx={{ width: 1280, maxHeight: 450 }}
                                    cols={6}
                                    rowHeight={164}
                                >
                                    {this.props.likes
                                        .filter((element) => element.mustWatch)
                                        .map((value) => (
                                            <MovieListElement
                                                movieID={value.movieID}
                                            />
                                        ))}
                                </ImageList>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>


                <div className="vote-section">
                <div className="must-watch-votes">
                                <h4 className="title">
                                    Likes
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button 
                                        id="like-button"
                                    >
                                        {this.props.likes.length}
                                    </Button>
                                </h4>

                            <ImageList
                                sx={{ width: 1280, maxHeight: 450 }}
                                cols={6}
                                rowHeight={164}
                            >
                                {this.props.likes.map((value) => (
                                    <MovieListElement movieID={value.movieID} />
                                ))}
                            </ImageList>
                        </div>
                </div>
            </div>
        );
    }
}
export default UserLikes;

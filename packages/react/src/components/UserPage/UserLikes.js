import React from "react";
import axios from "axios";

import MovieListElement from "../../components/Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";

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
                                <h4>
                                    Must Watch Movies (
                                    {
                                        this.props.likes.filter(
                                            (element) => element.mustWatch
                                        ).length
                                    }
                                    )
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
                    <h4>Likes ({this.props.likes.length})</h4>
                    <div className="must-watch-votes">
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

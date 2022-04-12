import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import MovieListElement from "../../components/Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";

import './UserPageData.css'

//props: dislikes = []

class UserDislikes extends React.Component {
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
            <div className="vote-section">
                {this.props.dislikes.length > 0 ? (
                    <div className="must-watch-votes">
                                <h4 className="title">
                                    Dislikes 
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button 
                                        id="like-button"
                                    >
                                        {this.props.dislikes.length}
                                    </Button>
                                </h4>
                        <ImageList
                            // sx={{ width: 80%, height: 60% }}
                            sx={{ width: 1280, maxHeight: 450 }}

                            cols={6}
                            // rowHeight={'auto'}
                            rowHeight={164}
                        >
                            {this.props.dislikes.map((value) => (
                                <MovieListElement movieID={value.movieId} />
                            ))}
                        </ImageList>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}
export default UserDislikes;

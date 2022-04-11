import React from "react";
import axios from "axios";

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
                    <div>
                        <h4>Dislikes ({this.props.dislikes.length})</h4>
                        <ImageList
                            // sx={{ width: 80%, height: 60% }}
                            sx={{ width: 1280, height: 450 }}

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

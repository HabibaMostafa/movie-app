import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

import "./VotesList.css";

class VotesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = { userVotes: [] };
        this.votesToAdd = null;
    }

    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        // potential end point for movie-votes
        axios.post("/user/movie-votes", params).then((res) => {
            if (res.status === 200) {
                this.setState({ userVotes: res.data });
            } else {
                this.setState({ userVotes: [] });
            }
        });
    }

    getVotesArray = () => {
        return this.state.userVotes;
    };

    render() {
        return (
            <div className="votesListContainer">
                <h3>Votes List</h3>
                <div>
                    <Paper style={{ maxHeight: 200, overflow: "auto", maxWidth: 300 }}>
                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                            }}
                        >
                            {this.state.userVotes.map((value) => (
                                <ListItem
                                    key={value}
                                >
                                    <ListItemText primary={value.movieTitle} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default VotesList;

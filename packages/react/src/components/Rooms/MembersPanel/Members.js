import React from "react";
import axios from "axios";

import AddMember from "./AddMember";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

class Members extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;

        this.state = { members: [] };
    }

    componentDidMount() {
        axios
            .get(`/members?roomId=${this.props.roomId}`)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ members: res.data });
                }
            })
            .catch((e) => {
                console.log("error getting memberlist... ", e);
            });
    }

    removeButtonHandler = async (data) => {};

    render() {
        if (this.state.members.length !== 0) {
            return (
                <div>
                    <h3>Add</h3>
                    <AddMember />

                    <h3>Members</h3>
                    <div>
                        <Paper
                            style={{
                                maxHeight: 200,
                                overflow: "auto",
                                maxWidth: 300,
                            }}
                        >
                            <List
                                sx={{
                                    width: "100%",
                                    maxWidth: 360,
                                    bgcolor: "background.paper",
                                }}
                            >
                                {this.state.members.map((value) => (
                                    <ListItem
                                        key={value}
                                        disableGutters
                                        secondaryAction={
                                            <IconButton
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.removeButtonHandler(
                                                        value
                                                    );
                                                }}
                                            >
                                                [X]
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                value.username +
                                                " (" +
                                                value.name +
                                                ")"
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </div>
                </div>
            );
        } else {
            return <div>loading...</div>;
        }
    }
}
export default Members;

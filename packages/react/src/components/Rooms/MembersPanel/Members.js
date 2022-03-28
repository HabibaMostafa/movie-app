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

        this.state = { members: [], updateKey: new Date().getTime() };
    }

    addMemberCallback = () => {
        this.setState({ members: [] });
    };

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

    recallComponent = async () => {
        await axios
            .get(`/members?roomId=${this.props.roomId}`)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ members: res.data });
                }
            })
            .catch((e) => {
                console.log("error getting memberlist... ", e);
            });
    };

    removeButtonHandler = async (data) => {
        const roomId = this.props.roomId;
        const userId = data.userId;

        if (roomId === undefined || userId === undefined) {
            return;
        }


        if (userId === this.props.userId) {
            console.log("You can't remove yourself from the memberlist.... must goto room details")
            return
        }

        const params = {
            roomId,
            userId,
        };

        await axios
            .delete("/member", { data: params })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);

                    // this.recallComponent();
                    this.setState({ members: [] });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    render() {
        if (this.state.members.length !== 0) {
            return (
                <div>
                    <AddMember
                        userId={this.props.userId}
                        roomId={this.props.roomId}
                        memberCallback={this.addMemberCallback}
                    />

                    <h3>Members</h3>
                    <div className="content-wrapper">
                        <Paper
                            style={{
                                maxHeight: 200,
                                overflow: "auto",
                                maxWidth: 300,
                                padding: 2
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
            this.recallComponent();
            return <div>loading...</div>;
        }
    }
}
export default Members;

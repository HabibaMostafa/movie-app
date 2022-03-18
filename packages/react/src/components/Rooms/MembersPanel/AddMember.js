// refered to example on https://mui.com/components/autocomplete/

import React from "react";
import axios from "axios";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

class AddMember extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
        this.state = {
            nonMembers: [],
            userToAdd: [],
            remountKey: new Date().getTime(),
        };
    }

    componentDidMount() {
        const userId = this.props.userId;
        const roomId = this.props.roomId;

        axios
            .get(`/non-members?roomId=${roomId}&userId=${userId}`)
            .then((response) => {
                const nonMemberList = response.data;
                this.setState({ nonMembers: nonMemberList });
            });
    }

    setUserToAdd = (selection) => {
        this.setState({ userToAdd: selection });
    };

    recallMount = () => {
        const userId = this.props.userId;
        const roomId = this.props.roomId;

        axios
            .get(`/non-members?roomId=${roomId}&userId=${userId}`)
            .then((response) => {
                const nonMemberList = response.data;
                this.setState({ nonMembers: nonMemberList });
            });
    };

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ remountKey: new Date().getTime() });
        }
    }

    // componentWillUnmount() {
    //     console.log("will unmount");
    // }

    addButtonHandler = async () => {
        const users = this.state.userToAdd;
        const roomId = this.props.roomId;

        const requestBody = {
            users,
            roomId,
        };

        await axios
            .post("/members", requestBody)
            .then((response) => {
                if (response.status === 201) {
                    // then added new members...
                }

                // this.setState({ remountKey: new Date().getTime() });
                // window.location.reload(true);
            })
            .catch((e) => {
                console.log(e);
                // this.setState({ remountKey: new Date().getTime() });
                // window.location.reload(true);
            });

        // // trigger a remount
        this.setState({ userToAdd: [] });
        this.setState({ nonMembers: [] });

        // trigger remount for memberlist
        this.props.memberCallback();
    };

    render() {
        if (this.state.nonMembers.length > 0) {
            return (
                <div>
                    <h3>Add friends to room</h3>
                    <div className="content-wrapper">
                        
                    <Stack spacing={3} sx={{ width: 300 }}>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={this.state.nonMembers}
                            getOptionLabel={(option) => option.username}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    // label="Multiple values"
                                    // placeholder="Invite"
                                />
                            )}
                            onChange={(e, selection) => {
                                this.setUserToAdd(selection);
                            }}
                        />
                        <Button
                        variant="contained"
                        id="add-member-btn"
                        onClick={this.addButtonHandler}
                    >
                        Add to Room
                    </Button>
                    </Stack>
                    </div>
                </div>
            );
        } else {
            {
                this.recallMount();
            }
            return <div></div>;
        }
    }
}

export default AddMember;

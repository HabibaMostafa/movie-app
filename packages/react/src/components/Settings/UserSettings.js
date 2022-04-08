import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import FormData from "form-data";

// userId={id}

let fileToUpload = null;
let fileName = "";
let filePath = "";
let currentAvatar = null;
let convertedAvatar = null;
let currentAvatarPath = "";

// 1mb limit
const fileSizeLimit = 1000000;

class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = { validFile: false, fetchedAvatar: false };
    }

    componentDidMount() {
        axios.get(`/avatars/${this.props.userId}`).then((response) => {
            // server converted this back to b64
            currentAvatar = response.data;

            // convertedAvatar = URL.createObjectURL(currentAvatar);
            // console.log(currentAvatar);

            // const b64 = (currentAvatar).toString("base64");
            const mimeType = "image/png";

            // console.log(currentAvatar);
            currentAvatarPath = `data:${mimeType};base64,${currentAvatar}`;

            // console.log(currentAvatarPath)

            this.setState({ fetchedAvatar: true });
        });
    }

    // const onDrop = useCallback();

    Dropzone = () => {
        const onDrop = useCallback((acceptedFiles) => {
            const fileSize = acceptedFiles[0].size;

            if (fileSize < fileSizeLimit) {
                this.setState({ validFile: true });

                fileToUpload = acceptedFiles[0];
                fileName = acceptedFiles[0].name;

                // filePath = acceptedFiles[0].path;
                filePath = URL.createObjectURL(fileToUpload);
            }

            // console.log(fileToUpload);
        }, []);

        const { getRootProps, getInputProps } = this.props.useDropzone({
            onDrop,
            accept: "image/*",
        });

        return (
            <div>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />

                    {this.state.validFile ? (
                        <div>
                            User Selection: {fileName}
                            <br />
                            <img src={filePath} height="300"></img>
                        </div>
                    ) : (
                        <div>Click here or drag and drop your image.</div>
                    )}
                </div>

                {this.state.validFile ? (
                    <div>
                        <br />
                        <Button
                            onClick={() => {
                                this.clearSelection();
                            }}
                        >
                            Clear Selection
                        </Button>

                        <Button
                            onClick={() => {
                                this.uploadImage();
                            }}
                        >
                            Set Avatar
                        </Button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        );
    };

    uploadImage = async () => {
        let form = new FormData();
        // form.append("avatar", filePath, fileName);
        form.append("avatar", fileToUpload, fileName);
        form.append("userId", this.props.userId);

        // console.log("hi");
        console.log(...form);

        // console.log(form.getHeaders());

        const response = await axios
            .post("/avatar", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => console.log(response));
    };

    clearSelection = () => {
        fileToUpload = null;
        fileName = "";
        filePath = "";
        this.setState({ validFile: false });
    };

    render() {
        return (
            <div>
                {console.log(this.state)}
                <h3>Set User Avatar</h3>

                {this.state.fetchedAvatar ? (
                    <div>
                        <h4>Current Avatar: </h4>
                        <br />
                        <img src={currentAvatarPath} height="50"></img>
                    </div>
                ) : (
                    <div></div>
                )}
                <this.Dropzone multiple={false} />
            </div>
        );
    }
}

export default UserSettings;

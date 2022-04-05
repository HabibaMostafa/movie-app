import React from "react";

import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const platformList = [
    { name: "Netflix", id: 8 },
    { name: "Disney Plus", id: 337 },
    { name: "Amazon Prime Video", id: 119 },
    { name: "Crave", id: 230 },
    { name: "Crave Plus", id: 231 },
    { name: "Crave Starz", id: 305 },
    { name: "Google Play Movies", id: 3 },
    { name: "Apple iTunes", id: 2 },
];

class PlatformFilter extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
        this.state = { filterOn: false, userSelectedPlatforms: [] };
    }

    filterByPlatform = (show) => {
        if (show) {
            return (
                <Stack spacing={3} sx={{ width: 300 }}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={platformList}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField {...params} variant="standard" />
                        )}
                        onChange={(e, selection) => {
                            // console.log(selection)
                            this.platformSelectionHandler(selection);
                        }}
                    />
                </Stack>
            );
        }
    };

    // await is needed here
    filterButtonHandler = async () => {
        await this.setState({
            filterOn: !this.state.filterOn,
        });

        await this.props.platformCallback([]);
        await this.setState({ userSelectedPlatforms: [] });
    };

    // await is needed here
    platformSelectionHandler = async (newSelection) => {
        await this.setState({ userSelectedPlatforms: newSelection });
        await this.props.platformCallback(this.state.userSelectedPlatforms);
    };

    render() {
        return (
            <div className="platform-filter-wrapper">
                {/* The button that will toggle showing or not showing the filter list */}
                <ToggleButton
                    onChange={() => {
                        this.filterButtonHandler();
                    }}
                >
                    <Button>Platform</Button>
                </ToggleButton>

                {/* The actual filter list */}
                {this.filterByPlatform(this.state.filterOn)}
            </div>
        );
    }
}

export default PlatformFilter;

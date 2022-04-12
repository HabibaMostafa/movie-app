import React from "react";
import axios from "axios";

import MovieListElement from "../../Movie/MovieListElement";
import ImageList from "@mui/material/ImageList";

import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

class RoomMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
        this.state = {
            matches: [],
            matchesAndProvider: [],
            providers: [],
            providersCount: new Object(),
            fetchedData: false,
            fetchedStreamProviders: false,
            checkedProviders: false,
            showStreamOptions: false,
            selectedProviders: [],
        };
    }

    componentDidMount() {
        axios
            .get(`/room-matches?roomId=${this.props.roomId}`)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ matches: result.data });
                }

                this.setState({ fetchedData: true });
            });

        axios
            .get(`/room-matches-providers?roomId=${this.props.roomId}`)
            .then((result) => {
                if (result.status === 200) {
                    // this.setState({ matches: result.data });

                    // console.log(result.data);
                    this.setState({ matchesAndProvider: result.data });
                    this.setState({ fetchedStreamProviders: true });

                    // check the provider list so that
                    this.populateProviderList(
                        this.state.fetchedStreamProviders
                    );
                }

                // this.setState({ fetchedData: true });
            });
    }

    showOnlySelectedStreams = (selection) => {};

    setSelectedProviders = (selection) => {
        this.setState({ selectedProviders: selection });
    };

    // populates the providers list for streaming companies
    populateProviderList = (populate) => {
        if (populate) {
            let providerList = new Set();
            let providersTally = new Object();

            for (let item of this.state.matchesAndProvider) {
                for (let provider of item.stream) {
                    // console.log(provider);
                    // if (provider != "provider") {
                    // }
                    providerList.add(provider);

                    // i have to do .toString() or else it breaks.... but its already a string?
                    if (providersTally.hasOwnProperty(provider.toString())) {
                        providersTally[provider.toString()] =
                            providersTally[provider.toString()] + 1;
                    } else {
                        providersTally[provider.toString()] = 1;
                    }
                }
            }

            // console.log(providerList);
            // console.log(providersTally);

            this.setState({ providers: Array.from(providerList) });
            this.setState({ providersCount: providersTally });
            this.setState({ checkedProviders: true });
        }
    };

    filterByStream = (show) => {
        if (show) {
            if (
                this.state.fetchedStreamProviders === true &&
                this.state.checkedProviders === true
            ) {
                return (
                    <Stack spacing={3} sx={{ width: 300 }}>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={this.state.providers}
                            getOptionLabel={(option) =>
                                option +
                                " (" +
                                this.state.providersCount[option] +
                                ")"
                            }
                            renderInput={(params) => (
                                <TextField {...params} variant="standard" />
                            )}
                            onChange={(e, selection) => {
                                this.setSelectedProviders(selection);
                            }}
                        />
                    </Stack>
                );
            } else {
                return <p>fetching stream availability, please wait...</p>;
            }
        }
    };

    filteredMovieList = (show) => {
        const filteredList = this.state.matchesAndProvider.filter((element) => {
            // console.log(element.stream)
            // console.log(this.state.selectedProviders)
            // return element.stream

            if (
                element.stream.some(
                    (provider) =>
                        this.state.selectedProviders.includes(provider) ||
                        this.state.selectedProviders.length < 1
                )
            ) {
                return element;
            }
        });

        // console.log(filteredList);

        if (show) {
            return (
                <ImageList
                    // sx={{ width: 1900, height: 450 }}
                    cols={6}
                    rowHeight={164}
                >
                    {filteredList.map((value) => (
                        // console.log(value.movieId)
                        <MovieListElement
                            movieID={value.movieId}
                            //onClick will handle nominations...
                            // onClick={console.log("clicked!")}
                        />
                    ))}
                </ImageList>
            );
        } else {
            return (
                <ImageList
                    // sx={{ width: 1900, height: 450 }}
                    cols={6}
                    rowHeight={164}
                >
                    {this.state.matches.map((value) => (
                        <MovieListElement
                            movieID={value}
                            //onClick will handle nominations...
                            // onClick={console.log("clicked!")}
                        />
                    ))}
                </ImageList>
            );
        }
    };

    render() {
        if (this.state.matches !== []) {
            if (this.state.matches.length > 0) {
                return (
                    <div>
                        {/* <p>Room Matches</p>

                        <p>roomId: {this.props.roomId}</p>
                        <p>user: Id {this.props.userId}</p> */}
                        <ToggleButton
                            value="check"
                            selected={this.state.showStreamOptions}
                            onChange={() => {
                                this.setState({
                                    showStreamOptions:
                                        !this.state.showStreamOptions,
                                });
                                this.setState({ selectedProviders: [] });
                            }}
                        >
                            <FilterListIcon />
                        </ToggleButton>

                        {this.filterByStream(this.state.showStreamOptions)}
                        {this.filteredMovieList(this.state.checkedProviders)}
                    </div>
                );
            }

            if (!this.state.fetchedData) {
                return <div>loading...</div>;
            } else {
                return <div>No Matches =(</div>;
            }
        } else {
            return <div>No Matches =(</div>;
        }
    }
}
export default RoomMatches;

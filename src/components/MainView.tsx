import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { API, Need, KeyedCollection, Marker, CreateMarker, IKeyedCollection } from '../API/API'
import { CalloutView } from './CalloutView'
import PageControl from 'react-native-page-control';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
let MapView = require('react-native-maps');

interface Props {
}

interface State {
    needs: Need[]
    categories: KeyedCollection<any>
    currentPage: number
}
export class MainView extends Component<Props, State> {
    intervalId: number;

    constructor(props) {
        super(props);
        this.state = {
            needs: [],
            categories: new KeyedCollection,
            currentPage: 0
        }
    }

    componentDidMount() {
        this.getNeeds()
        this.getCategories()
    }

    async getCategories() {
        let categories = await API.getCategories()
        if (categories !== undefined || categories !== null) {
            this.setState({ categories: categories })
        }
    }

    async getNeeds() {
        let needs = await API.getNeeds();
        if (needs !== undefined || needs !== null) {
            this.setState({ needs: needs })
        }
    }

    renderItem = ({ item, index }: { item: string, index: number }) => {
        let { width, height } = Dimensions.get('window');
        console.log(`width ${width}, height: ${height}`);
        return (
            <View style={[styles.cardItem, { width: width - 20 }]}>
                <CalloutView />
            </View >
        )
    };

    keyExtractor = (_: string, index: number): string => {
        return `${index}`
    };

    onScrollEnd = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        this.setState({ currentPage: pageNum })
    };

    renderNeeds () {
        if (this.state.needs.length === 0) {
            return
        }

        return this.state.needs.filter(marker => marker.latitude && marker.longitude)
            .map(marker => {
                return (
                    <MapView.Marker
                        pinColor={marker.markerType === 'need' ? 'red' : 'blue'}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }}
                        title={marker.category}
                        description={marker.description}
                        key={marker.id}
                    />
                )

            })
    }

    render() {
        const {height} = Dimensions.get('window');

        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: 29.7630556,
                        longitude: -95.3630556,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                >
                    {this.renderNeeds()}
                </MapView>

                <View style={StyleSheet.flatten([styles.cardSheet, { height: height / 3.0 }])}>
                    <View style={styles.actionButtonContainer}>
                        <TouchableOpacity activeOpacity={0.9} style={StyleSheet.flatten([styles.actionButton, styles.actionButtonFilter])}>
                            <FAIcon name="filter" size={15} style={styles.actionButtonIcon} />
                            <Text style={styles.actionButtonText}> FILTER </Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9} style={StyleSheet.flatten([styles.actionButton, styles.actionButtonNeed])}>
                            <EntypoIcon name="edit" size={15} style={styles.actionButtonIcon} />
                            <Text style={styles.actionButtonText}>NEED</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardWrapper}>
                        <FlatList data={['Wheelbarrow', 'Labor', 'Labor']}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            horizontal={true}
                            pagingEnabled={true}
                            onMomentumScrollEnd={this.onScrollEnd}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>

                <PageControl
                    style={styles.pageControl}
                    numberOfPages={3}
                    currentPage={this.state.currentPage}
                    pageIndicatorTintColor='gray'
                    currentPageIndicatorTintColor='red'
                    indicatorStyle={{ borderRadius: 5 }}
                    currentIndicatorStyle={{ borderRadius: 5 }}
                    indicatorSize={{ width: 8, height: 8 }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardSheet: {
        left: 0,
        right: 0,
        bottom: 10,
        height: 240,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute'
    },
    cardWrapper: {
        flex: 1
    },
    cardItem: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 6,
        backgroundColor: "#fff",
    },
    actionButtonContainer: {
        height: 44,
        flexDirection: 'row',
        alignContent: 'space-around',
        justifyContent: 'space-between',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    actionButton: {
        height: 40,
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        marginRight: 20,
        marginLeft: 20,
    },
    actionButtonIcon: {
        color: "#FFF",
        marginRight: 5
    },
    actionButtonFilter: {
        backgroundColor: '#FF5A5F',
    },
    actionButtonNeed: {
        backgroundColor: '#0080FE',
    },
    actionButtonText: {
        color: 'white'
    },
    pageControl: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 15
    },
    pageControlIndicator: {
        borderRadius: 5
    }
});

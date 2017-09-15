import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import {
    API,
    Need,
    KeyedCollection,
    Marker,
    CreateMarker,
    IKeyedCollection
} from '../API/API'

import { ModalView } from './ModalView';
import { Separator } from "./Separator";
import { HavesView, MarkerType } from './HavesView';
import { Colors } from './Colors';

interface Props {
    cancelTapped: () => void
}

interface State {
    markers: Need[],
    modalVisible: boolean,
    selectedNeed: Need
}

export class NeedListView extends Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            markers: [],
            modalVisible: false,
            selectedNeed: null
        }
    }

    getMarkers = async () => {
        try {
            let markers = await API.getMyMarkers()
            this.setState({ markers: markers })
        } catch (error) {

        }

    }
    componentDidMount() {
        this.getMarkers()
    }

    itemSelected = (item: Need) => {
        this.setState({ modalVisible: true, selectedNeed: item })
    }

    renderItem = ({ item, index }: { item: Need, index: number }) => {
        let width = Dimensions.get('window').width
        return (
            <TouchableOpacity style={{ height: 45, justifyContent: 'center' }}
                onPress={() => this.itemSelected(item)}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 45, alignItems: 'center' }}>
                    <FAIcon name={'map-marker'} size={20} style={{ color: '#A2AEB6', marginLeft: 10, marginRight: 10 }} />
                    <Text style={{ position: 'absolute', left: 15 + 10 + 10, width: width - 65, color: Colors.needText }}
                        numberOfLines={2}>{item.address}</Text>
                    <FAIcon name={'angle-right'} size={20} style={{ color: '#A2AEB6', marginLeft: 10, marginRight: 10 }} />
                </View>
            </TouchableOpacity>
        )
    }

    keyExtractor = (_: string, index: number): string => {
        return `${index}`
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal visible={this.state.modalVisible} animationType={'slide'}>
                    <HavesView cancelTapped={() => {
                        this.setState({ modalVisible: false })
                        this.getMarkers()
                    }}
                        markerType={MarkerType.Need}
                        editingNeed={this.state.selectedNeed} />
                </Modal>
                <View style={{
                    height: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{ color: Colors.needText, fontWeight: '600' }}>My Needs</Text>
                </View>
                <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <FlatList data={this.state.markers}
                    ItemSeparatorComponent={Separator}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor} />
                <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 45
                    }}
                        onPress={this.props.cancelTapped} >
                        <Text style={{ color: '#A2AEB6', fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={{ height: 45, width: 1, backgroundColor: 'rgba(0,0,0,0.1)' }}></View>
                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#50E3C2',
                        height: 45
                    }}
                        onPress={() => this.setState({ modalVisible: true, selectedNeed: undefined })}>
                        <Text style={{ color: 'white', fontWeight: '600' }}>Create New Need</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
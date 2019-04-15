import {
    DEVICE_LIST_GET_LIST,
    DEVICE_LIST_GET_LIST_SUCCESS,
    DEVICE_LIST_GET_LIST_ERROR,
    DEVICE_LIST_GET_LIST_WITH_FILTER,
    DEVICE_LIST_GET_LIST_WITH_ORDER,
    DEVICE_LIST_GET_LIST_SEARCH,
    DEVICE_LIST_ADD_ITEM,
    DEVICE_LIST_ADD_ITEM_SUCCESS,
    DEVICE_LIST_ADD_ITEM_ERROR,
    DEVICE_LIST_SELECTED_ITEMS_CHANGE
} from 'Constants/actionTypes';


export const getDeviceList = () => ({
    type: DEVICE_LIST_GET_LIST
});

export const getDeviceListSuccess = (items) => ({
    type: DEVICE_LIST_GET_LIST_SUCCESS,
    payload: items
});

export const getDeviceListError = (error) => ({
    type: DEVICE_LIST_GET_LIST_ERROR,
    payload: error
});

export const getDeviceListWithFilter = (column, value) => ({
    type: DEVICE_LIST_GET_LIST_WITH_FILTER,
    payload: { column, value }
});

export const getDeviceListWithOrder = (column) => ({
    type: DEVICE_LIST_GET_LIST_WITH_ORDER,
    payload: column
});

export const getDeviceListSearch = (keyword) => ({
    type: DEVICE_LIST_GET_LIST_SEARCH,
    payload: keyword
});

export const addDeviceItem = (item) => ({
    type: DEVICE_LIST_ADD_ITEM,
    payload: item
});

export const addDeviceItemSuccess = (items) => ({
    type: DEVICE_LIST_ADD_ITEM_SUCCESS,
    payload: items
});

export const addDeviceItemError = (error) => ({
    type: DEVICE_LIST_ADD_ITEM_ERROR,
    payload: error
});

export const selectedDeviceItemsChange = (selectedItems) => ({
    type: DEVICE_LIST_SELECTED_ITEMS_CHANGE,
    payload: selectedItems
});

import axios from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getDateWithFormat } from "Util/Utils";

import {
  DEVICE_LIST_GET_LIST,
  DEVICE_LIST_ADD_ITEM
} from "Constants/actionTypes";

import {
  getDeviceListSuccess,
  getDeviceListError,
  addDeviceItemSuccess,
  addDeviceItemError
} from "./actions";

import deviceListData from "Data/survey.list.json";

const getDeviceListRequest = async () => {
  return axios.get("http://127.0.0.1:8080/api/devices", {})
  .then((response)=>{
    console.log(response.data)
    return response.data;
}).catch((err)=>{
    console.log("Error in response");
    console.log(err);
})
};

function* getDeviceListItems() {
  try {
    const response = yield call(getDeviceListRequest);
    yield put(getDeviceListSuccess(response));
  } catch (error) {
    yield put(getDeviceListError(error));
  }
}

const addDeviceItemRequest = async item => {
  let items = deviceListData.data;
  item.id = items.length + 1;
  item.createDate = getDateWithFormat();
  items.splice(0, 0, item);
  // return await new Promise((success, fail) => {
  //   setTimeout(() => {
  //     success(items);
  //   }, 1000);
  // })
  //   .then(response => response)
  //   .catch(error => error);
  axios.post('http://127.0.0.1:8080/api/devices', item)
  .then(function (response) {
    console.log('addDeviceItemSuccess'+response);
    addDeviceItemSuccess(items)
  })
  .catch(function (error) {
    console.log('addDeviceItemError'+error);
    addDeviceItemError(error)
  });
};

function* addDeviceItem({ payload }) {
  try {
    const response = yield call(addDeviceItemRequest, payload);
    yield put(addDeviceItemSuccess(response));
  } catch (error) {
    yield put(addDeviceItemError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(DEVICE_LIST_GET_LIST, getDeviceListItems);
}

export function* wathcAddItem() {
  yield takeEvery(DEVICE_LIST_ADD_ITEM, addDeviceItem);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(wathcAddItem)]);
}

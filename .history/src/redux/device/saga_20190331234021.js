import axios from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { getDateWithFormat } from "Util/Utils";

import {
  SURVEY_LIST_GET_LIST,
  SURVEY_LIST_ADD_ITEM
} from "Constants/actionTypes";

import {
  getSurveyListSuccess,
  getSurveyListError,
  addSurveyItemSuccess,
  addSurveyItemError
} from "./actions";

import surveyListData from "Data/survey.list.json";

const getSurveyListRequest = async () => {
  return axios.get("http://127.0.0.1:8080/api/devices", {})
  .then((response)=>{
    console.log(response.data)
    return response.data;
}).catch((err)=>{
    console.log("Error in response");
    console.log(err);
})
};

function* getSurveyListItems() {
  try {
    const response = yield call(getSurveyListRequest);
    yield put(getSurveyListSuccess(response));
  } catch (error) {
    yield put(getSurveyListError(error));
  }
}

const addSurveyItemRequest = async item => {
  let items = surveyListData.data;
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
  axios.post('http://127.0.0.1:8080/api/messages', items[0])
  .then(function (response) {
    console.log('addSurveyItemSuccess'+response);
    addSurveyItemSuccess(items)
  })
  .catch(function (error) {
    console.log('addSurveyItemError'+error);
    addSurveyItemError(error)
  });
};

function* addSurveyItem({ payload }) {
  try {
    const response = yield call(addSurveyItemRequest, payload);
    yield put(addSurveyItemSuccess(response));
  } catch (error) {
    yield put(addSurveyItemError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(SURVEY_LIST_GET_LIST, getSurveyListItems);
}

export function* wathcAddItem() {
  yield takeEvery(SURVEY_LIST_ADD_ITEM, addSurveyItem);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(wathcAddItem)]);
}

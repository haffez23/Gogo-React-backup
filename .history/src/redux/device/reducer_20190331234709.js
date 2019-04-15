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

const INIT_STATE = {
	allDeviceItems: null,
	deviceItems: null,
	error: '',
	filter: null,
	searchKeyword: '',
	orderColumn: null,
	loading: false,
	labels: [
		{ label: "EDUCATION", color: "secondary" },
		{ label: "NEW FRAMEWORK", color: "primary" },
		{ label: "PERSONAL", color: "info" }
	],
	orderColumns: [
		{ column: "title", label: "Title" },
		{ column: "category", label: "Category" },
		{ column: "status", label: "Status" },
		{ column: "label", label: "Label" },
	],
	categories: ["Development", "Worklplace", "Hardware"],
	selectedItems: []
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case DEVICE_LIST_GET_LIST:
			return { ...state, loading: false };

		case DEVICE_LIST_GET_LIST_SUCCESS:
			return { ...state, loading: true, allDeviceItems: action.payload, deviceItems: action.payload };

		case DEVICE_LIST_GET_LIST_ERROR:
			return { ...state, loading: true, error: action.payload };

		case DEVICE_LIST_GET_LIST_WITH_FILTER:
			if (action.payload.column === '' || action.payload.value == '') {
				return { ...state, loading: true, deviceItems: state.allDeviceItems, filter: null };
			} else {
				const filteredItems = state.allDeviceItems.filter((item) =>
					item[action.payload.column] === action.payload.value);
				return {
					...state, loading: true, deviceItems: filteredItems, filter: {
						column: action.payload.column,
						value: action.payload.value
					}
				}
			}

		case DEVICE_LIST_GET_LIST_WITH_ORDER:
			if (action.payload === '') {
				return { ...state, loading: true, deviceItems: state.deviceItems, orderColumn: null };
			} else {
				const sortedItems = state.deviceItems.sort((a, b) => {
					if (
						a[action.payload] <
						b[action.payload]
					)
						return -1;
					else if (
						a[action.payload] >
						b[action.payload]
					)
						return 1;
					return 0;
				})
				return { ...state, loading: true, deviceItems: sortedItems, orderColumn: state.orderColumns.find(x => x.column === action.payload) }
			}

		case DEVICE_LIST_GET_LIST_SEARCH:
			if (action.payload === '') {
				return { ...state, deviceItems: state.allDeviceItems };
			} else {
				const keyword = action.payload.toLowerCase();
				const searchItems = state.allDeviceItems.filter((item) =>
					item.title.toLowerCase().indexOf(keyword) > -1 || item.detail.toLowerCase().indexOf(keyword) > -1 || item.status.toLowerCase().indexOf(keyword) > -1 || item.category.toLowerCase().indexOf(keyword) > -1 || item.label.toLowerCase().indexOf(keyword) > -1);
				return { ...state, loading: true, deviceItems: searchItems, searchKeyword: action.payload }
			}

		case DEVICE_LIST_ADD_ITEM:
			return { ...state, loading: false };

		case DEVICE_LIST_ADD_ITEM_SUCCESS:
			return { ...state, loading: true, allDeviceItems: action.payload, deviceItems: action.payload };

		case DEVICE_LIST_ADD_ITEM_ERROR:
			return { ...state, loading: true, error: action.payload };

		case DEVICE_LIST_SELECTED_ITEMS_CHANGE:
			return { ...state, loading: true, selectedItems: action.payload};
		default: return { ...state };
	}
}

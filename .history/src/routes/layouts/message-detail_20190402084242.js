import React, { Component, Fragment } from "react";
import { injectIntl} from 'react-intl';
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import IntlMessages from "Util/IntlMessages";
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  CustomInput,
  Form
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import DatePicker from "react-datepicker";
import moment from "moment";
import TagsInput from "react-tagsinput";
import Switch from "rc-switch";
import ReactAutosuggest from "Components/ReactAutosuggest";
import Rating from "Components/Rating";
import { SliderTooltip, RangeTooltip } from "Components/SliderTooltip";
import FineUploaderTraditional from "fine-uploader-wrappers";
import Gallery from "react-fine-uploader";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "rc-switch/assets/index.css";
import "rc-slider/assets/index.css";
import "react-rater/lib/react-rater.css";
import "react-fine-uploader/gallery/gallery.css";
import axios from 'axios';

const uploader = new FineUploaderTraditional({
  options: {
    chunking: {
      enabled: false
    },
    deleteFile: {
      enabled: true,
      endpoint: "/uploads"
    },
    request: {
      endpoint: "/uploads"
    }
  }
});

const cakeData = [
  {
    name: "Marble Cake"
  },
  {
    name: "Fruitcake"
  },
  {
    name: "Chocolate Cake"
  },
  {
    name: "Fat Rascal"
  },
  {
    name: "Financier"
  },
  {
    name: "Genoise"
  },
  {
    name: "Gingerbread"
  },
  {
    name: "Goose Breast"
  },
  {
    name: "Parkin"
  },
  {
    name: "Petit Gâteau"
  },
  {
    name: "Salzburger Nockerl"
  },
  {
    name: "Soufflé"
  },
  {
    name: "Streuselkuchen"
  },
  {
    name: "Tea Loaf"
  },
  {
    name: "Napoleonshat"
  },
  {
    name: "Merveilleux"
  },
  {
    name: "Magdalena"
  },
  {
    name: "Cremeschnitte"
  },
  {
    name: "Cheesecake"
  },
  {
    name: "Bebinca"
  }
];

const SELECT_DATA = [
  { label: "Chocolate", value: "chocolate", key: 0 },
  { label: "Vanilla", value: "vanilla", key: 1 },
  { label: "Strawberry", value: "strawberry", key: 2 },
  { label: "Caramel", value: "caramel", key: 3 },
  { label: "Cookies and Cream", value: "cookiescream", key: 4 },
  { label: "Peppermint", value: "peppermint", key: 5 }
];

const apiUrl ="http://127.0.0.1:8080/api/"

class FormsUi extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.handleChangeEmbedded = this.handleChangeEmbedded.bind(this);
    this.handleChangeDateTime = this.handleChangeDateTime.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);

    this.state = {
      selectedOptions: [],
      selectedOption: "",
      startDate: null,
      startDateTime: null,
      startDateRange: null,
      endDateRange: null,
      embeddedDate: moment(),
      tags: [],
      switchCheckedPrimary: false,
      switchCheckedPrimaryInverse: true,
      switchCheckedSecondary: true,
      switchCheckedSecondaryInverse: false,
      suggestionValue: "",
      suggestions: []
    };
  }
  componentDidMount() {
    this.dataListRender();
  }

  dataListRender() {

    const {selectedPageSize,currentPage,selectedOrderOption,search} = this.state;
    // axios.get(`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`)
    axios.get(`${apiUrl}messages`)

    .then(res => {
      return res.data        
    }).then(data=>{
      this.setState({
        totalPage: data.totalPage,
        items: data.findOne((e)=>e._id=this.props.match.params.id),
        selectedItems:[],
        totalItemCount : data.totalItem,
        isLoading:true
      });
      console.log("selected DEV"+this.state.items)
    })
   
  }

  onSuggestionChange = (event, { newValue }) => {
    this.setState({
      suggestionValue: newValue
    });
  };

  handleTagChange(tags) {
    this.setState({ tags });
  }

  handleChangeMulti = selectedOptions => {
    this.setState({ selectedOptions });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleChangeEmbedded(date) {
    this.setState({
      embeddedDate: date
    });
  }

  handleChangeDate(date) {
    this.setState({
      startDate: date
    });
  }

  handleChangeDateTime(date) {
    this.setState({
      startDateTime: date
    });
  }

  handleChangeStart(date) {
    this.setState({
      startDateRange: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDateRange: date
    });
  }

  render() {
    const {messages} = this.props.intl;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="Update Message" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

      
        <Row>
          <Colxx xxs="12" xl="8" className="mb-4">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="Message" />
                </CardTitle>
                <label>
                  <IntlMessages id="Content" />
                </label>
                <div className="mb-5">
                  <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChangeDate}
                    placeholderText={messages["forms.date"]}
                  />
                </div>
                <label>
                  <IntlMessages id="form-components.date-range" />
                </label>
                <Row className="mb-5">
                  <Colxx xxs="6">
                    <DatePicker
                      selected={this.state.startDateRange}
                      selectsStart
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeStart}
                      placeholderText={messages["form-components.start"]}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="LLL"
                      timeCaption="Time"
                    />
                  </Colxx>
                  <Colxx xxs="6">
                    <DatePicker
                      selected={this.state.endDateRange}
                      selectsEnd
                      startDate={this.state.startDateRange}
                      endDate={this.state.endDateRange}
                      onChange={this.handleChangeEnd}
                      placeholderText={messages["form-components.end"]}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="LLL"
                      timeCaption="Time"
                    />
                  </Colxx>
                </Row>

                <label>
                  <IntlMessages id="form-components.date-with-time" />
                </label>
                <DatePicker
                  className="mb-5"
                  selected={this.state.startDateTime}
                  onChange={this.handleChangeDateTime}
                  placeholderText={messages["forms.date"]}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="LLL"
                  timeCaption="Time"
                />
              </CardBody>
            </Card>
          </Colxx>

          <Colxx xxs="12" xl="4" className="mb-4">
            <Card className="h-100">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="Calendar" />
                </CardTitle>
                <DatePicker
                  calendarClassName="embedded"
                  inline
                  selected={this.state.embeddedDate}
                  onChange={this.handleChangeEmbedded}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="form-components.fine-uploader" />
                </CardTitle>
                <Gallery
                  animationsDisabled={true}
                  uploader={uploader}
                  deleteButton-children={<span>Delete</span>}
                  fileInput-children={<span />}
                >
                  <span className="react-fine-uploader-gallery-dropzone-content">
                    <IntlMessages id="form-components.drop-files-here" />
                  </span>
                </Gallery>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

      
     </Fragment>
    );
  }
}
export default injectIntl(FormsUi)
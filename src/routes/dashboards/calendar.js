import React, { Component, Fragment } from "react";
import IntlMessages from "Util/IntlMessages";
import { injectIntl} from 'react-intl';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Progress,
  Form,
  FormGroup,
  Button,
  Label,
  Input,
  CustomInput,
  CardHeader
} from "reactstrap";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Colxx, Separator } from "Components/CustomBootstrap";
import BreadcrumbContainer from "Components/BreadcrumbContainer";
import { CalendarToolbar } from "Components/Calendar/CalendarToolbar";
import { PolarShadow, LineShadow, SmallLineChart } from "Components/Charts";
import {
  visitChartConfig,
  conversionChartConfig,
  lineChartConfig,
  polarChartConfig,
  smallChartData1,
  smallChartData2,
  smallChartData3,
  smallChartData4
} from "Constants/chartConfig";

import BigCalendar from "react-big-calendar";
import moment from "moment";
import ReactTable from "react-table";
import CircularProgressbar from "react-circular-progressbar";
import { Chart } from "react-chartjs-2";
import ReactSiemaCarousel from "Components/ReactSiema/ReactSiemaCarousel";
import Rating from "Components/Rating";
import DataTablePagination from "Components/DataTables/pagination";
import Sortable from "react-sortablejs";

import "chartjs-plugin-datalabels";
import "react-circular-progressbar/dist/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-table/react-table.css";

//import eventsData from "Data/events.json";
import axios from 'axios';


Chart.defaults.global.plugins.datalabels.display = false;

const selectData = [
  { label: "Chocolate", value: "chocolate", key: 0 },
  { label: "Vanilla", value: "vanilla", key: 1 },
  { label: "Strawberry", value: "strawberry", key: 2 },
  { label: "Caramel", value: "caramel", key: 3 },
  { label: "Cookies and Cream", value: "cookiescream", key: 4 },
  { label: "Peppermint", value: "peppermint", key: 5 }
];

const selectDataType = [
  { label: "Cake", value: "cake", key: 0 },
  { label: "Cupcake", value: "cupcake", key: 1 },
  { label: "Dessert", value: "dessert", key: 2 }
];

const dataTableColumns = [
  {
    Header: "Name",
    accessor: "name",
    Cell: props => <p className="list-item-heading">{props.value}</p>
  },
  {
    Header: "Sales",
    accessor: "sales",
    Cell: props => <p className="text-muted">{props.value}</p>
  },
  {
    Header: "Stock",
    accessor: "stock",
    Cell: props => <p className="text-muted">{props.value}</p>
  },
  {
    Header: "Category",
    accessor: "category",
    Cell: props => <p className="text-muted">{props.value}</p>
  }
];


//const events = eventsData.data;


const apiUrl ="http://127.0.0.1:8080/api/"

BigCalendar.momentLocalizer(moment);

class DefaultDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);

    this.state = {
      events : [],
      selectedOptions: [],
      selectedOptionsType: [],
      isLoading:false,
      selectedDevice:"",
      numberOfMessage : 0,


    };
  }
  componentDidMount() {
    this.dataListRender();
  
  }
  dataListRender() {

    const {selectedPageSize,currentPage,selectedOrderOption,search} = this.state;
    // axios.get(`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`)
    
   
    const selectedDevice = this.props.match.params.p
    axios.get(`${apiUrl}messages/${selectedDevice}`)
    .then(res => {
      console.log('MESSAGES'+res.data)
      
      let events1 = res.data.data.map((n,i) => {
  
        return (
        {
          id: i,
          title: n.content,
          start: new Date(n.displayAt),
          end: new Date(n.hiddenAt),
        })

      }
      )
             
      this.setState({
        events: events1,
        numberOfMessage: res.data.numberOfMessage,
        isLoading:true
      });
    })
 
  }
  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleChangeType = selectedOptionsType => {
    this.setState({ selectedOptionsType });
  };

  render() {
    const {messages} = this.props.intl;
    return (
      <Fragment >
        <Row>
          <Colxx xxs="12">
            <BreadcrumbContainer
              heading={<IntlMessages id="menu.default" />}
              match={this.props.match}
            />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
       
        <Sortable
          options={{
            handle: ".handle"
          }}
          className="row"
        >
          <Colxx xl="4" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="Number of messages" />
                  {this.state.numberOfMessage}
                  {console.log('Number of messages=='+this.state.events.length)}
                </CardTitle>



                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={100}
                    text={this.state.numberOfMessage}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="4" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="Pending Message" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={75}
                    text={"75%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xl="4" lg="6" className="mb-4">
            <Card>
              <CardHeader className="p-0 position-relative">
                <div className="position-absolute handle card-icon">
                  <i className="simple-icon-shuffle" />
                </div>
              </CardHeader>
              <CardBody className="d-flex justify-content-between align-items-center">
                <CardTitle className="mb-0">
                  <IntlMessages id="Next Message" />
                </CardTitle>
                <div className="progress-bar-circle">
                  <CircularProgressbar
                    strokeWidth={4}
                    percentage={32}
                    text={"32%"}
                  />
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Sortable>

        <Row>
          <Colxx xl="12" lg="12" className="mb-6">
            <Card>
              <CardBody>
                <CardTitle>
                  <IntlMessages id="dashboards.calendar" />
                </CardTitle>
                <BigCalendar
                  style={{ minHeight: "400px" }}
                  events={this.state.events}
                  views={["month"]}
                  components={{
                    toolbar: CalendarToolbar
                  }}
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>

       
       
     </Fragment>
    );
  }
}
export default injectIntl(DefaultDashboard);

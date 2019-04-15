import React, { Component, Fragment } from "react";
import { injectIntl} from 'react-intl';
import {
  Row,
  Card,
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  UncontrolledDropdown,
  Collapse,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
  CardBody,
  CardSubtitle,
  CardImg,
  Label,
  CardText,
  Badge
} from "reactstrap";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "Components/CustomSelectInput";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";

import Pagination from "Components/List/Pagination";
import mouseTrap from "react-mousetrap";
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { auth } from "firebase";
function collect(props) {
  return { data: props.data };
}
const apiUrl ="http://127.0.0.1:8080/api/"

class DataListLayout extends Component {
    constructor(props) {
      super(props);
      this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
      this.toggleSplit = this.toggleSplit.bind(this);
      this.dataListRender = this.dataListRender.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.getIndex = this.getIndex.bind(this);
      this.onContextMenuClick = this.onContextMenuClick.bind(this);


      this.state = {
        displayMode: "list",
        pageSizes: [10, 20, 30, 50, 100],
        selectedPageSize: 10,
        categories:  [
          {label:'Cakes',value:'Cakes',key:0},
          {label:'Cupcakes',value:'Cupcakes',key:1},
          {label:'Desserts',value:'Desserts',key:2},
        ],
        orderOptions:[
          {column: "title",label: "Product Name"},
          {column: "category",label: "Category"},
          {column: "status",label: "Status"}
        ],
        selectedOrderOption:  {column: "title",label: "Product Name"},
        dropdownSplitOpen: false,
        modalOpen: false,
        modalLarge: false,

        currentPage: 1,
        totalItemCount: 0,
        totalPage: 1,
        search: "",
        selectedItems: [],
        lastChecked: null,
        displayOptionsIsOpen: false,
        isLoading:false,
        content: "",
        displayAt: "",
        hiddenAt : "",
        username : "",
        device_id : {},
        devices: [],

        selectedUsers:[],
        startDate: null,
        startDateTime: null,
        startDateRange: null,
        endDateRange: null,
      };
      this.toggleLarge = this.toggleLarge.bind(this);
      this.handleChangeStart = this.handleChangeStart.bind(this);
      this.handleChangeEnd = this.handleChangeEnd.bind(this);
    }
    
    componentWillMount() {
      this.props.bindShortcut(["ctrl+a", "command+a"], () =>
        this.handleChangeSelectAll(false)
      );
      this.props.bindShortcut(["ctrl+d", "command+d"], () => {
        this.setState({
          selectedItems: []
        });
        return false;
      });
    }
    addNetItem() {
      const newItem = {
        content: this.state.content,
        displayAt: this.state.displayAt,
        hiddenAt : this.state.hiddenAt,
        username : localStorage.getItem('user_email'),
        device_id : this.state.device.key
  
      };
      console.log('name: '+newItem.name +'code :'+newItem.code+' User :'+newItem.user)

      //this.props.addDeviceItem(newItem);
       axios.post('http://127.0.0.1:8080/api/messages', newItem)
       .then(function (response) {
        this.dataListRender();

      })
       .catch(function (error) {
        
      });

      this.toggleModal();
      this.setState({
        content: "",
        label: {},
        device: {},
        status: "ACTIVE",
  
      });
    }
    toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
      });
    }
    toggleLargeUpdate(device) {
      this.setState({
        modalLarge: !this.state.modalLarge,
      });
    }
    toggleLarge() {
      this.setState({
        modalLarge: !this.state.modalLarge,
      });
    }
    toggleDisplayOptions() {
      this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
    }
    toggleSplit() {
      this.setState(prevState => ({
        dropdownSplitOpen: !prevState.dropdownSplitOpen
      }));
    }
    changeOrderBy(column) {
      this.setState(
        {
          selectedOrderOption: this.state.orderOptions.find(
            x => x.column === column
          )
        },
        () => this.dataListRender()
      );
    }
    changePageSize(size) {
      this.setState(
        {
          selectedPageSize: size,
          currentPage: 1
        },
        () => this.dataListRender()
      );
    }
    changeDisplayMode(mode) {
      this.setState({
        displayMode: mode
      });
      return false;
    }
    onChangePage(page) {
      this.setState(
        {
          currentPage: page
        },
        () => this.dataListRender()
      );
    }

    handleKeyPress(e) {
      if (e.key === "Enter") {
        this.setState(
          {
            search: e.target.value.toLowerCase()
          },
          () => this.dataListRender()
        );
      }
    }

    handleCheckChange(event, id) {
      if (
        event.target.tagName == "A" ||
        (event.target.parentElement &&
          event.target.parentElement.tagName == "A")
      ) {
        return true;
      }
      if (this.state.lastChecked == null) {
        this.setState({
          lastChecked: id
        });
      }

      let selectedItems = this.state.selectedItems;
      if (selectedItems.includes(id)) {
        selectedItems = selectedItems.filter(x => x !== id);
      } else {
        selectedItems.push(id);
      }
      this.setState({
        selectedItems
      });

      if (event.shiftKey) {
        var items = this.state.items;
        var start = this.getIndex(id, items, "id");
        var end = this.getIndex(this.state.lastChecked, items, "id");
        items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
        selectedItems.push(
          ...items.map(item => {
            return item.id;
          })
        );
        selectedItems = Array.from(new Set(selectedItems));
        this.setState({
          selectedItems
        });
      }
      document.activeElement.blur();
    }

    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    }
    handleChangeSelectAll(isToggle) {
      if (this.state.selectedItems.length >= this.state.items.length) {
        if (isToggle) {
          this.setState({
            selectedItems: []
          });
        }
      } else {
        this.setState({
          selectedItems: this.state.items.map(x => x.id)
        });
      }
      document.activeElement.blur();
      return false;
    }
    handleChangeEnd(date) {
      this.setState({
        endDateRange: date,
        hiddenAt: date,
      });
    }
    handleChangeStart(date) {
      this.setState({
        startDateRange: date,
        displayAt : date
      });
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
          items: data,
          selectedItems:[],
          totalItemCount : data.totalItem,
          isLoading:true
        });
      })
      axios.get(`${apiUrl}devices`)

      .then(res => {
        return res.data        
      }).then(data=>{
        this.setState({
          totalPage: data.totalPage,
          devices: data,
          selectedUsers:[],
          totalItemCount : data.totalItem,
          isLoading:true
        });
      })
    }

    

    onContextMenuClick = (e, data, target) => {
      console.log("onContextMenuClick - selected items",this.state.selectedItems)
      console.log("onContextMenuClick - action : ", data.action);
    };

    onContextMenu = (e, data) => {
      const clickedProductId = data.data;
      if (!this.state.selectedItems.includes(clickedProductId)) {
        this.setState({
          selectedItems :[clickedProductId]
        });
      }

      return true;
    };

    render() {
      const startIndex= (this.state.currentPage-1)*this.state.selectedPageSize
      const endIndex= (this.state.currentPage)*this.state.selectedPageSize
      const {messages} = this.props.intl;
      return (
        !this.state.isLoading?
          <div className="loading"></div>
       :
        <Fragment>
          <div className="disable-text-selection">
            <Row>
              <Colxx xxs="12">
                <div className="mb-2">
                  <h1>
                    <IntlMessages id="Device" />
                  </h1>

                  <div className="float-sm-right">
                    <Button
                      color="primary"
                      size="lg"
                      className="top-right-button"
                      onClick={this.toggleModal}
                    >
                      <IntlMessages id="layouts.add-new" />
                    </Button>
                    {"  "}


                  <Modal
                    isOpen={this.state.modalLarge}
                    size="lg"
                    toggle={this.toggleLarge}
                  >
                    <ModalHeader toggle={this.toggleLarge}>
                      Edit Message
                    </ModalHeader>
                    <ModalBody>

                      
                      <Label>
                          <IntlMessages id="content" />
                        </Label>
                        <Input 

                        onChange={event => {
                          this.setState({ code: event.target.value });
                        }}
                        />
                         <label className="mt-5">
                  <IntlMessages id="form-components.date" />
                </label >
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

                        <Label className="mt-4">
                          <IntlMessages id="Device" />
                        </Label>
                        <Select
                          components={{ Input: CustomSelectInput }}
                          className="react-select"
                          classNamePrefix="react-select"
                          name="form-field-name"
                          options={ (
                            this.state.devices.map((item, index) => {
                              return { label: item.name ,value: item.name, key: item._id}
                            })
                          
                        )}
                        value={this.state.user}

                        onChange={val => {
                          this.setState({ user: val });
                        }}

                        />


                    </ModalBody>
                    <ModalFooter toggle={this.toggleLarge}>
                        <Button
                            color="secondary"
                            outline
                            onClick={this.toggleLarge}
                          >
                            <IntlMessages id="layouts.cancel" />
                          </Button>
                          <Button color="primary" onClick={() => this.updateMessageItem()}>
                            <IntlMessages id="layouts.submit" />
                          </Button>{" "}
                    </ModalFooter>
                  </Modal>



                    <Modal
                      isOpen={this.state.modalOpen}
                      toggle={this.toggleModal}
                      wrapClassName="modal-right"
                      backdrop="static"
                    >
                      <ModalHeader toggle={this.toggleModal}>
                        <IntlMessages id="Add New Message" />
                      </ModalHeader>
                      <ModalBody>
                        <Label>
                          <IntlMessages id="Content" />
                        </Label>
                        <Input 
                        onChange={event => {
                          this.setState({ content: event.target.value });
                        
                        }}
                        placeholder ="Content"
                        />
                     


                         <label className="mt-4">
                  <IntlMessages id="Starting Date" />
                </label >
                      
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
                     <label className="mt-4">
                  <IntlMessages id="Ending Date" />
                </label >
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

                        <Label className="mt-4">
                          <IntlMessages id="Device" />
                        </Label>
                        <Select
                          components={{ Input: CustomSelectInput }}
                          className="react-select"
                          classNamePrefix="react-select"
                          placeholder ="Device"

                          name="form-field-name"
                          options={ (
                            this.state.devices.map((item, index) => {
                              return { label: item.name ,value: item.name, key: item._id}
                            })
                          
                        )}
                        value={this.state.device}

                        onChange={val => {
                          this.setState({ device: val });
                        }}

                        />










            
                     
                       
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          outline
                          onClick={this.toggleModal}
                        >
                          <IntlMessages id="layouts.cancel" />
                        </Button>
                        <Button color="primary" onClick={() => this.addNetItem()}>
                          <IntlMessages id="layouts.submit" />
                        </Button>{" "}
                      </ModalFooter>
                    </Modal>
                    <ButtonDropdown
                      isOpen={this.state.dropdownSplitOpen}
                      toggle={this.toggleSplit}
                    >
                      <div className="btn btn-primary pl-4 pr-0 check-button">
                        <Label
                          for="checkAll"
                          className="custom-control custom-checkbox mb-0 d-inline-block"
                        >
                          <Input
                            className="custom-control-input"
                            type="checkbox"
                            id="checkAll"
                            checked={
                              this.state.selectedItems.length >=
                              this.state.items.length
                            }
                            onClick={() => this.handleChangeSelectAll(true)}
                          />
                          <span
                            className={`custom-control-label ${
                              this.state.selectedItems.length > 0 &&
                              this.state.selectedItems.length <
                                this.state.items.length
                                ? "indeterminate"
                                : ""
                            }`}
                          />
                        </Label>
                      </div>
                      <DropdownToggle
                        caret
                        color="primary"
                        className="dropdown-toggle-split pl-2 pr-2"
                      />
                      <DropdownMenu right>
                        <DropdownItem>
                          <IntlMessages id="layouts.delete" />
                        </DropdownItem>
                        <DropdownItem>
                          <IntlMessages id="layouts.another-action" />
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>

                  <BreadcrumbItems match={this.props.match} />
                </div>

                <div className="mb-2">
                  <Button
                    color="empty"
                    className="pt-0 pl-0 d-inline-block d-md-none"
                    onClick={this.toggleDisplayOptions}
                  >
                    <IntlMessages id="layouts.display-options" />{" "}
                    <i className="simple-icon-arrow-down align-middle" />
                  </Button>
                  <Collapse
                    isOpen={this.state.displayOptionsIsOpen}
                    className="d-md-block"
                    id="displayOptions"
                  >
                 

                    <div className="d-block d-md-inline-block">
                      <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                        <DropdownToggle caret color="outline-dark" size="xs">
                          <IntlMessages id="layouts.orderby" />
                          {this.state.selectedOrderOption.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.orderOptions.map((order, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changeOrderBy(order.column)}
                              >
                                {order.label}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                      <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                        <input
                          type="text"
                          name="keyword"
                          id="search"
                          placeholder={messages["menu.search"]}
                          onKeyPress={e => this.handleKeyPress(e)}
                        />
                      </div>
                    </div>
                    <div className="float-md-right">
                      <span className="text-muted text-small mr-1">{`${startIndex}-${endIndex} of ${
                        this.state.totalItemCount
                      } `}</span>
                      <UncontrolledDropdown className="d-inline-block">
                        <DropdownToggle caret color="outline-dark" size="xs">
                          {this.state.selectedPageSize}
                        </DropdownToggle>
                        <DropdownMenu right>
                          {this.state.pageSizes.map((size, index) => {
                            return (
                              <DropdownItem
                                key={index}
                                onClick={() => this.changePageSize(size)}
                              >
                                {size}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </Collapse>
                </div>
                <Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              {this.state.items.map(device => {
                  return (
                    <Colxx
                      sm="6"
                      lg="4"
                      xl="3"
                      className="mb-3"
                      key={device._id}
                    >
                      <ContextMenuTrigger
                        id="menu_id"
                        data={device._id}
                        collect={collect}
                      >
                        <Card
                          onClick={event =>
                            this.handleCheckChange(event, device._id)
                          }
                          className={classnames({
                            active: this.state.selectedItems.includes(
                              device._id
                            )
                          })}
                        >
                          <div className="position-relative">
                            <NavLink
                              to={`?p=${device._id}`}
                              className="w-40 w-sm-100"
                            >
                              
                            </NavLink>
                            <Badge
                              color={device.statusColor}
                              pill
                              className="position-absolute badge-top-left"
                            >
                              DISPLAYED
                            </Badge>
                          </div>
                          <CardBody>
                            <Row>
                              
                              <Colxx xxs="12" className="mb-3">
                                <CardSubtitle></CardSubtitle>
                                <CardText className="text-muted text-small mb-0 font-weight-light">
                                {device.content}
                                
                                </CardText>
                              </Colxx>
                            </Row>
                          </CardBody>
                          <NavLink className="btn "     to= {`/app/layouts/message-detail/${device._id}`}   >
                              <i className="iconsmind-Edit"></i>
                            </NavLink>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                } 
                
              )}
              <Pagination
                currentPage={this.state.currentPage}
                totalPage={this.state.totalPage}
                onChangePage={i => this.onChangePage(i)}
              />
            </Row>
          </div>

          <ContextMenu
            id="menu_id"
            onShow={e => this.onContextMenu(e, e.detail.data)}
          >
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "copy" }}
            >
              <i className="simple-icon-docs" /> <span>Copy</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "move" }}
            >
              <i className="simple-icon-drawer" /> <span>Move to archive</span>
            </MenuItem>
            <MenuItem
              onClick={this.onContextMenuClick}
              data={{ action: "delete" }}
            >
              <i className="simple-icon-trash" /> <span>Delete</span>
            </MenuItem>
          </ContextMenu>
        </Fragment>
      );
    }
  }
  export default injectIntl(mouseTrap(DataListLayout))

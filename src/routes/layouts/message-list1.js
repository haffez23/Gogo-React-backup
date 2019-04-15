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

import IntlMessages from "Util/IntlMessages";
import { Colxx, Separator } from "Components/CustomBootstrap";
import { BreadcrumbItems } from "Components/BreadcrumbContainer";

import Pagination from "Components/List/Pagination";
import mouseTrap from "react-mousetrap";
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
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
        currentPage: 1,
        totalItemCount: 0,
        totalPage: 1,
        search: "",
        selectedItems: [],
        lastChecked: null,
        displayOptionsIsOpen: false,
        isLoading:false,
        fullname : "",
        username : "",
        email : "",
        password : "",
        device : {},
        devices: [],
        
      };
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
        email: this.state.email,
        username: this.state.username,
        name : this.state.fullname,
        password : this.state.password,
        device : this.state.device,
        
  
      };
      //this.props.addUserItem(newItem);
      axios.post('http://127.0.0.1:8080/api/signup', newItem)
      .then(function (response) {
       this.dataListRender();

     })
      .catch(function (error) {
       
     });
      this.toggleModal();
      this.setState({
        email: "",
        username: "",
        name : "",
        password : "",
        device: {},
        status: "ACTIVE",
  
      });
    }
    toggleModal() {
      this.setState({
        modalOpen: !this.state.modalOpen
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
        var messages = this.state.messages;
        var start = this.getIndex(id, messages, "id");
        var end = this.getIndex(this.state.lastChecked, messages, "id");
        messages = messages.slice(Math.min(start, end), Math.max(start, end) + 1);
        selectedItems.push(
          ...messages.map(item => {
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
      if (this.state.selectedItems.length >= this.state.messages.length) {
        if (isToggle) {
          this.setState({
            selectedItems: []
          });
        }
      } else {
        this.setState({
          selectedItems: this.state.messages.map(x => x.id)
        });
      }
      document.activeElement.blur();
      return false;
    }
    componentDidMount() {
      this.dataListRender();
    }

    dataListRender() {

      const {selectedPageSize,currentPage,selectedOrderOption,search} = this.state;
      // axios.get(`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`)
      axios.get(`${apiUrl}messages`)

      .then(res => {
        console.log('Res Data device'+res.data.data)
        return res.data.data        
      }).then(data=>{
        this.setState({
          totalPage: data.totalPage,
          messages: data,
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
          selectedItems:[],
          totalItemCount : data.totalItem,
          isLoading:true
        });
      })
    }

    onContextMenuClick = (e, data, target) => {
      console.log("onContextMenuClick - selected messages",this.state.selectedItems)
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
                    <IntlMessages id="User List" />
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
                      isOpen={this.state.modalOpen}
                      toggle={this.toggleModal}
                      wrapClassName="modal-right"
                      backdrop="static"
                    >
                      <ModalHeader toggle={this.toggleModal}>
                        <IntlMessages id="Add User" />
                      </ModalHeader>
                      <ModalBody>
                        <Label>
                          <IntlMessages id="Full Name" />
                        </Label>
                        <Input 
                        onChange={event => {
                          this.setState({ fullname: event.target.value });
                        }}
                        />
                        <Label className="mt-4">
                          <IntlMessages id="Username" />
                        </Label>
                        <Input 
                        onChange={event => {
                          this.setState({ username: event.target.value });
                        }}
                        />
                        <Label className="mt-4">
                          <IntlMessages id="Email" />
                        </Label>
                        <Input
                        onChange={event => {
                          this.setState({ email: event.target.value });
                        }}
                        />
                        <Label className="mt-4">
                          <IntlMessages id="Password" />
                        </Label>
                        <Input
                        onChange={event => {
                          this.setState({ password: event.target.value });
                        }}
                        />
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
                              this.state.messages.length
                            }
                            onClick={() => this.handleChangeSelectAll(true)}
                          />
                          <span
                            className={`custom-control-label ${
                              this.state.selectedItems.length > 0 &&
                              this.state.selectedItems.length <
                                this.state.messages.length
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
<Separator className="mb-5" />
              </Colxx>
            </Row>
            <Row>
              {this.state.messages.map(device => {
                if (this.state.displayMode === "imagelist") {
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
                              DOWN
                            </Badge>
                          </div>
                          <CardBody>
                            <Row>
                              <Colxx xxs="4">
                                <CustomInput
                                  className="itemCheck mb-0"
                                  type="checkbox"
                                  id={`check_${device._id}`}
                                  checked={this.state.selectedItems.includes(
                                    device._id
                                  )}
                                  onChange={() => {}}
                                  label=""
                                />
                              </Colxx>
                              <Colxx xxs="8" className="mb-3">
                                <CardSubtitle>{device.name}</CardSubtitle>
                                <CardText className="text-muted text-small mb-0 font-weight-light">
                                No Message to display
                                
                                </CardText>
                              </Colxx>
                            </Row>
                          </CardBody>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                } 
                 else {
                  return (
                    <Colxx xxs="12" key={device.id} className="mb-3">
                      <ContextMenuTrigger
                        id="menu_id"
                        data={device._id}
                        collect={collect}
                      >
                        <Card
                          onClick={event =>
                            this.handleCheckChange(event, device._id)
                          }
                          className={classnames("d-flex flex-row", {
                            active: this.state.selectedItems.includes(
                              device._id
                            )
                          })}
                        >
                          <div className="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-messages-lg-center">
                              <NavLink
                                to={`?p=${device._d}`}
                                className="w-25 w-sm-100"
                              >
                                <p className="list-item-heading mb-1 truncate">
                                  {device.name}
                                </p>
                              </NavLink>
                              <p className="mb-1 text-muted text-small w-25 w-sm-100">
                              {device.username}
                              </p>
                              <p className="mb-1 text-muted text-small w-25 w-sm-100">
                              {device.email}

                              </p>
                              <div className="w-10 w-sm-100">
                                <Badge color={device.statusColor} pill>
                                  Status
                                </Badge>
                              </div>
                            </div>
                            <div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
                              <CustomInput
                                className="itemCheck mb-0"
                                type="checkbox"
                                id={`check_${device.id}`}
                                checked={this.state.selectedItems.includes(
                                  device.id
                                )}
                                onChange={() => {}}
                                label=""
                              />
                            </div>
                          </div>
                        </Card>
                      </ContextMenuTrigger>
                    </Colxx>
                  );
                }
              })}
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

/* jshint esversion: 6 */

import React from 'react';
import StopwatchListComponent from './stopwatch-list.jsx';
import axios from "axios";
import * as constants from "../../common/constants.js";

class StopwatchManagerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        stopwatches : props.stopwatches || []
    };    
    this._onAdd = this._onAdd.bind(this);
    // this.fetchStopwatches = this.props.fetchStopwatches.bind(this);
  }

//   _fetchStopwatches(){
//     axios.get(constants.URL_TIMEENTRY_GETALL)
//     .then((response) => {

//         let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
//         ls = ls instanceof Array ? ls : [];
//         let swMap = new Map(ls);              

//         let data = Object.assign([],  Array.from(swMap.values()), response.data);
//         for(let d of data){
//           let storage = swMap.get(d.storageId);
//           if(storage && storage.updateDate > d.updateDate){
//             d = Object.assign({}, d, storage);
//           }
//         }

//         this.setState(() => {
//             return {stopwatches: data};
//         });        
//     })
//     .catch((e) => {
//         console.log(`Error trying to getting TimeEntries from API(${constants.URL_TIMEENTRY_GETALL}) : ${e}`);
        
//         //Get local storage of stopwatches
//         let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
//         ls = ls instanceof Array ? ls : [];
//         let swMap = new Map(ls);

//         this.setState(() => {
//             return {stopwatches: Array.from(swMap.values())};
//         });        
//     });
//   }

  _onAdd () {
      
    let data = {
        storageId : "sw" + Date.now(),        
        projectId : 1,
        updateDate : Date.now()         
    };       

    axios.post(constants.URL_TIMEENTRY_CREATE, data)
    .then((response) => {
        let newSw = response.data;
        let sws = this.state.stopwatches;
        sws.push(newSw);        
        this.setState({
            stopwatches: sws
        });
    })
    .catch((e) => {
        console.log(`Error trying to create TimeEntry on API(${constants.URL_TIMEENTRY_CREATE}) : ${e}`);
        
        //Get local storage of stopwatches
        let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
        ls = ls instanceof Array ? ls : [];
        let swMap = new Map(ls);        

        //Update this stopwatches map entry
        swMap.set(data.storageId, data);

        //Update local storage entry
        localStorage.setItem(constants.LOCAL_STORAGE_ID_STOPWATCHES, JSON.stringify(Array.from(swMap)));
        let sws = this.state.stopwatches;
        sws.push(data);
        this.setState({
            stopwatches: sws
        });
    });    
  }

  removeStopwatch(storageId){
    let index = this.state.stopwatches.findIndex(x => x.storageId == storageId);
    this.state.stopwatches.splice(index, 1);      
    this.setState({
      stopwatches : this.state.stopwatches
    });
  } 

  componentDidMount() {    
    //   this._fetchStopwatches();    
  }

  componentWillReceiveProps(props){
      this.state = {
        stopwatches : props.stopwatches
    }; 
  } 

  render() {

    return (
        <div>
            <div id="btnAddStopwatch" className="row z-depth-3 valign-wrapper hoverable" onClick={this._onAdd}>
                <div className="col s8">
                    <p>
                        Press the ADD button to create a new timer.
                    </p>
                </div>
                <div className="col s4 center-align">
                    <a href="#" className="btn-floating btn-large waves-effect waves-light cyan pulse"><i className="fa fa-plus"></i></a>
                </div>                
            </div>
            <StopwatchListComponent
                activeTimeEntry={this.props.activeTimeEntry} 
                stopwatches={this.state.stopwatches} 
                removeStopwatch={this.removeStopwatch.bind(this)}
                setActiveTimeEntry={this.props.setActiveTimeEntry.bind(this)} /> 
        </div>                
    );
  }

}

export default StopwatchManagerComponent;
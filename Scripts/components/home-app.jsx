/* jshint esversion: 6 */

import React from 'react';
import {render} from 'react-dom';
import axios from "axios";
import * as constants from "../common/constants.js";
import StopwatchManagerComponent from './stopwatch/stopwatch-manager.jsx';
import TaskManagerComponent from './task/task-manager.jsx';

class HomeApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks : [],
            stopwatches : [],
            activeTimeEntry : 0,
            activeTimers : []
        };

        this.fetchStopwatches = this.fetchStopwatches.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.setActiveTimeEntry = this.setActiveTimeEntry.bind(this);
    }

    setActiveTimeEntry(timeEntryId){
        this.state.activeTimeEntry = timeEntryId;        
        this.setState({
            activeTimeEntry : timeEntryId
        });
        this.fetchTasks();
    }

    fetchStopwatches(){
        axios.get(constants.URL_TIMEENTRY_GETALL)
        .then((response) => {

            let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
            ls = ls instanceof Array ? ls : [];
            let swMap = new Map(ls);              

            let data = Object.assign([],  Array.from(swMap.values()), response.data);
            for(let d of data){
            let storage = swMap.get(d.storageId);
            if(storage && storage.updateDate > d.updateDate){
                d = Object.assign({}, d, storage);
            }
            }

            this.setState({               
                stopwatches: data,
                activeTimeEntry : data ? data[0].timeEntryId : 0             
            });        
        })
        .catch((e) => {
            console.log(`Error trying to getting TimeEntries from API(${constants.URL_TIMEENTRY_GETALL}) : ${e}`);
            
            //Get local storage of stopwatches
            let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
            ls = ls instanceof Array ? ls : [];
            let swMap = new Map(ls);

            this.setState(() => {
                return {stopwatches: Array.from(swMap.values())};
            });        
        });
    }

    fetchTasks(){
        axios.get(constants.API_TASKS_GETALL + this.state.activeTimeEntry)
        .then((response) => {

            let lsId = `t${this.state.activeTimeEntry}`;

            //Get local storage of tasks
            let localTasks = JSON.parse(localStorage.getItem(lsId));
            localTasks = localTasks instanceof Array ? localTasks : [];             

            let data = Object.assign([],  localTasks, response.data);
            // for(let d of data){
            //     let task = localTasks.find(t => t.taskId);
            //     if(task && task.updateDate > d.updateDate){
            //         d = Object.assign({}, d, task);
            //     }
            // }

            this.setState({
                tasks: data
            });        
        })
        .catch((e) => {
            console.log(`Error trying to getting Tasks from API(${constants.API_TASKS_GETALL + this.state.activeTimeEntry}) : ${e}`);
            
            let lsId = `t${this.state.timeEntryId}`;

            //Get local storage of tasks
            let localTasks = JSON.parse(localStorage.getItem(lsId));
            localTasks = localTasks instanceof Array ? localTasks : [];

            this.setState({
                tasks : localTasks
            });      
        });
    }

    componentDidMount(){
        this.fetchStopwatches();
        if(this.state.stopwatches.length > 0){
            this.timersContainer.classList.remove("offset-s4");
            this.tasksContainer.classList.add("scale-in");
        }else{
            this.tasksContainer.classList.remove("scale-in");
            this.timersContainer.classList.add("offset-s4");            
        }        
    }

    componentDidUpdate(){
        if(this.state.stopwatches.length > 0){
            this.timersContainer.classList.remove("offset-s4");
            this.tasksContainer.classList.add("scale-in");
        }else{
            this.tasksContainer.classList.remove("scale-in");
            this.timersContainer.classList.add("offset-s4");            
        }  
    } 

    render() {
        return (
            <div className="row">
                <div ref={(e) => this.timersContainer = e} className="col s5">
                    <StopwatchManagerComponent activeTimeEntry={this.state.activeTimeEntry} stopwatches={this.state.stopwatches} setActiveTimeEntry={this.setActiveTimeEntry.bind(this)} ></StopwatchManagerComponent>
                </div>
                <div ref={(e) => this.tasksContainer = e} className="col s7 scale-transition scale-out scale-in">
                    <TaskManagerComponent timeEntryId={this.state.activeTimeEntry} tasks={this.state.tasks}  ></TaskManagerComponent>
                </div>
            </div>                           
        );
    }

}

render(<HomeApp />, document.getElementById("home-app"));

export default HomeApp;
/* jshint esversion: 6 */

import React from 'react';
import TaskListComponent from './task-list.jsx';
import axios from "axios";
import * as constants from "../../common/constants.js";

class TaskManagerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            timeEntryId : props.timeEntryId || 0,
            taskDescription : "",
            taskType : "Bug",
            tasks : props.tasks || []
        };

        // this._fetchTasks = this._fetchTasks.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.removeTask = this.removeTask.bind(this);    
    }

    // _fetchTasks(){
    //     axios.get(constants.API_TASKS_GETALL + this.state.timeEntryId)
    //     .then((response) => {

    //         let lsId = `t${this.timeEntryId}`;

    //         //Get local storage of tasks
    //         let localTasks = JSON.parse(localStorage.getItem(lsId));
    //         localTasks = localTasks instanceof Array ? localTasks : [];             

    //         let data = Object.assign([],  localTasks, response.data);
    //         // for(let d of data){
    //         //     let task = localTasks.find(t => t.taskId);
    //         //     if(task && task.updateDate > d.updateDate){
    //         //         d = Object.assign({}, d, task);
    //         //     }
    //         // }

    //         this.setState({
    //             tasks: data
    //         });        
    //     })
    //     .catch((e) => {
    //         console.log(`Error trying to getting Tasks from API(${constants.API_TASKS_GETALL + this.state.timeEntryId}) : ${e}`);
            
    //         let lsId = `t${this.timeEntryId}`;

    //         //Get local storage of tasks
    //         let localTasks = JSON.parse(localStorage.getItem(lsId));
    //         localTasks = localTasks instanceof Array ? localTasks : [];

    //         this.setState({
    //             tasks : localTasks
    //         });      
    //     });
    // }

    _addTask() {
        
        let taskData = {
            type : this.state.taskType,        
            description : this.state.taskDescription,
            timeEntryId : this.state.timeEntryId         
        };       

        axios.post(constants.API_TASKS_CREATE, taskData)
        .then((response) => {            
            this.state.tasks.push(response.data);                    
            this.setState({
                tasks: this.state.tasks,
                taskDescription: ''
            });
        })
        .catch((e) => {
            console.log(`Error trying to create Task for Entry:${taskData.timeEntryId} on API(${constants.API_TASKS_CREATE}) : ${e}`);
            
            //Local Storage Id for Array of task for certain time entry
            let lsId = `t${this.state.timeEntryId}`;

            //Get local storage of tasks
            let localTasks = JSON.parse(localStorage.getItem(lsId));
            localTasks = localTasks instanceof Array ? localTasks : [];                   

            //Update this stopwatches map entry
            localTasks.push(taskData);

            //Update local storage entry
            localStorage.setItem(lsId, JSON.stringify(localTasks));

            this.state.tasks.push(taskData);                    
            this.setState({
                tasks: this.state.tasks
            });
        });    
    }

    removeTask(taskId){
        let index = this.state.tasks.findIndex(x => x.taskId == taskId);
        this.state.tasks.splice(index, 1);      
        this.setState({
            tasks : this.state.tasks,
            taskDescription: ''
        });
    } 

    componentDidMount() {    
        //this._fetchTasks();
        this.inputDescription.focus();    
    }

    componentWillReceiveProps(props){
        this.state = {
            timeEntryId : props.timeEntryId || 0,
            taskDescription : "",
            taskType : "Bug",
            tasks : props.tasks || []
        }; 
    } 

    onChange(event) {
        this.setState({taskDescription: event.target.value});
    }  

    onSubmit(event){
        this._addTask();
        event.preventDefault();
    }  

    render() {
        return (
            <div id={`t${this.state.timeEntryId}`}>
                <div className="row">
                    <form className="col s12" onSubmit={this.onSubmit}>        
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="fa fa-commenting prefix"></i>
                                <textarea ref={(e) => this.inputDescription = e} id="TaskDescription" className="materialize-textarea" value={this.state.taskDescription} data-length="120" onChange={this.onChange}></textarea>
                                <label htmlFor="TaskDescription">Task Description</label>
                            </div>
                            <div className="col s6 offset-s6 center-align">
                                <button className="btn waves-effect waves-light" type="submit" name="action">Submit <i className="fa fa-send-o"></i></button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="row">
                    <div className="col s12">
                        <TaskListComponent tasks={this.state.tasks} removeTask={this.removeTask.bind(this)} />    
                    </div>
                </div>
            </div>                           
        );
    }

}

export default TaskManagerComponent;
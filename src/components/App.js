import React from "react";
import StopwatchManager from "./StopwatchManager";
import TaskManager from "./TaskManager";
import { generateGuid } from "../helpers";
import * as constants from "../constants";

class App extends React.Component {
  timersContainerRef = React.createRef();
  tasksContainerRef = React.createRef();

  state = {
    tasks: [],
    stopwatches: [],
    activeTimeEntry: null,
    activeTimers: []
  };

  setActiveTimeEntry = timeEntryId => {
    this.setState({
      activeTimeEntry: timeEntryId
    });

    if (timeEntryId) {
      this.fetchTasks(timeEntryId);
    }
  };

  fetchStopwatches = () => {
    //Get local storage of stopwatches
    let stopwatches = JSON.parse(
      localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES)
    );

    stopwatches = stopwatches instanceof Array ? stopwatches : [];

    this.setState(() => {
      return { stopwatches };
    });
  };

  fetchTasks = timeEntryId => {
    let lsId = `tks${timeEntryId}`;
    //Get local storage of tasks
    let localTasks = JSON.parse(localStorage.getItem(lsId));
    localTasks = localTasks instanceof Array ? localTasks : [];

    this.setState(() => {
      return { tasks: localTasks };
    });
  };

  addTask = (timeEntryId, description, type) => {
    let taskData = {
      type: type,
      description: description,
      timeEntryId: timeEntryId,
      taskId: generateGuid()
    };

    let tasks = this.state.tasks;
    tasks.push(taskData);

    this.setState({
      tasks,
      taskDescription: ""
    });

    //Local Storage Id for Array of task for certain time entry
    let lsId = `tks${timeEntryId}`;

    //Update local storage entry
    localStorage.setItem(lsId, JSON.stringify(tasks));
  };

  removeTask = (taskId, timeEntryId) => {
    let tasks = this.state.tasks;
    let index = tasks.findIndex(x => x.taskId === taskId);
    tasks.splice(index, 1);
    this.setState({
      tasks,
      taskDescription: ""
    });

    //Local Storage Id for Array of task for certain time entry
    let lsId = `tks${timeEntryId}`;

    //Update local storage entry
    localStorage.setItem(lsId, JSON.stringify(tasks));
  };

  addStopwatch = () => {
    let data = {
      timeEntryId: generateGuid(),
      projectId: 1,
      updateDate: Date.now()
    };

    let stopwatches = this.state.stopwatches;
    //console.log(stopwatches);
    stopwatches.push(data);
    this.setState({
      stopwatches
    });

    //Update local storage entry
    localStorage.setItem(
      constants.LOCAL_STORAGE_ID_STOPWATCHES,
      JSON.stringify(stopwatches)
    );
  };

  removeStopwatch = timeEntryId => {
    const stopwatches = this.state.stopwatches;
    let index = stopwatches.findIndex(x => x.timeEntryId === timeEntryId);
    stopwatches.splice(index, 1);

    this.setState({
      stopwatches
    });

    //Update local storage entry
    localStorage.setItem(
      constants.LOCAL_STORAGE_ID_STOPWATCHES,
      JSON.stringify(stopwatches)
    );
  };

  componentDidMount() {
    // console.log("App did mount");
    // console.log(this.state.stopwatches);
    this.fetchStopwatches();

    //UI thingys
    if (this.state.stopwatches.length > 0) {
      this.timersContainerRef.value.classList.remove("offset-s4");
      this.tasksContainerRef.value.classList.add("scale-in");
    } else {
      this.tasksContainerRef.value.classList.remove("scale-in");
      this.timersContainerRef.value.classList.add("offset-s4");
    }
  }

  componentDidUpdate() {
    // console.log("App did update");
    // console.log(this.state.stopwatches);
    // console.log(this.state.stopwatches.length);
    if (this.state.stopwatches.length > 0) {
      this.timersContainerRef.value.classList.remove("offset-s4");
      this.tasksContainerRef.value.classList.add("scale-in");
    } else {
      this.tasksContainerRef.value.classList.remove("scale-in");
      this.timersContainerRef.value.classList.add("offset-s4");
    }
  }

  render() {
    return (
      <div className="row">
        <div ref={this.timersContainerRef} className="col s5">
          <StopwatchManager
            activeTimeEntry={this.state.activeTimeEntry}
            stopwatches={this.state.stopwatches}
            setActiveTimeEntry={this.setActiveTimeEntry}
            addStopwatch={this.addStopwatch}
            removeStopwatch={this.removeStopwatch}
          />
        </div>
        <div
          ref={this.tasksContainerRef}
          className="col s6 offset-s1 scale-transition scale-out scale-in"
        >
          <TaskManager
            activeTimeEntry={this.state.activeTimeEntry}
            tasks={this.state.tasks}
            addTask={this.addTask}
            removeTask={this.removeTask}
          />
        </div>
      </div>
    );
  }
}

export default App;

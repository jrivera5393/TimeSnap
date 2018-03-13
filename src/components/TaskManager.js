/* jshint esversion: 6 */

import React from "react";
import PropTypes from "prop-types";
import TaskList from "./TaskList";

class TaskManager extends React.Component {
  inputDescriptionRef = React.createRef();

  state = {
    activeTimeEntry: this.props.activeTimeEntry,
    taskDescription: "",
    taskType: "Bug",
    tasks: this.props.tasks || []
  };

  static propTypes = {
    activeTimeEntry: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    taskDescription: PropTypes.string,
    taskType: PropTypes.string,
    tasks: PropTypes.array
  };

  componentDidMount() {
    if (this.state.activeTimeEntry != null) {
      this.inputDescriptionRef.value.focus();
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      activeTimeEntry: props.activeTimeEntry || 0,
      taskDescription: "",
      taskType: "Bug",
      tasks: props.tasks || []
    });
  }

  onChange = event => {
    event.preventDefault();
    this.setState({ taskDescription: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    this.props.addTask(
      this.state.activeTimeEntry,
      this.inputDescriptionRef.value.value,
      "Bug"
    );

    // refresh the form
    event.currentTarget.reset();
  };

  render() {
    console.log(this.props.activeTimeEntry);
    if (this.props.activeTimeEntry == null) {
      return <div />;
    } else {
      return (
        <div id={`t${this.state.activeTimeEntry}`}>
          <div className="row">
            <form className="col s12" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="input-field col s12">
                  <i class="material-icons prefix fa fa-pencil" />
                  <textarea
                    ref={this.inputDescriptionRef}
                    rows="2"
                    id="TaskDescription"
                    className="materialize-textarea"
                    value={this.state.taskDescription}
                    maxLength="120"
                    data-length="120"
                    onChange={this.onChange}
                  />
                  <label htmlFor="TaskDescription">Task Description</label>
                </div>
                <div className="col s6 offset-s6 center-align">
                  <button
                    className="btn waves-effect waves-light"
                    type="submit"
                    name="action"
                  >
                    Submit <i className="fa fa-send-o" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="row">
            <div className="col s12">
              <TaskList
                tasks={this.state.tasks}
                removeTask={this.props.removeTask}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default TaskManager;

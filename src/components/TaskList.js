/* jshint esversion: 6 */

import React from "react";
import PropTypes from "prop-types";
import TaskComponent from "./Task";

class TaskList extends React.Component {
  ulRef = React.createRef();

  static propTypes = {
    tasks: PropTypes.array,
    removeTask: PropTypes.func
  };

  componentDidMount() {
    setTimeout(() => this.ulRef.value.classList.add("scale-in"), 100);
  }

  componentDidUpdate() {
    if (this.props.tasks.length > 0) {
      this.ulRef.value.classList.remove("fadeOut");
      this.ulRef.value.classList.add("scale-in");
      this.ulRef.value.classList.add("animated", "fadeIn");
    } else {
      this.ulRef.value.classList.remove("fadeIn");
      this.ulRef.value.classList.add("animated", "fadeOut");
    }
  }

  render() {
    return (
      <ul
        ref={this.ulRef}
        id="ulTaskList"
        className="collection scale-transition scale-out"
      >
        {this.props.tasks.map((t, index) => (
          <TaskComponent
            key={t.taskId}
            task={t}
            removeTask={this.props.removeTask}
          />
        ))}
      </ul>
    );
  }
}

export default TaskList;

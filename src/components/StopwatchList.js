/* jshint esversion: 6 */

import React from "react";
import PropTypes from "prop-types";
import Stopwatch from "./Stopwatch";

class StopwatchList extends React.Component {
  static propTypes = {
    stopwatches: PropTypes.array,
    activeTimeEntry: PropTypes.string,
    removeStopwatch: PropTypes.func,
    setActiveTimeEntry: PropTypes.func
  };

  render() {
    console.log(this.props.stopwatches);
    return (
      <div id="stopwatch-list">
        {this.props.stopwatches.length === 0
          ? null
          : this.props.stopwatches.map((sw, index) => (
              <Stopwatch
                id={`${sw.timeEntryId}`}
                key={`${sw.timeEntryId}`}
                timeEntry={sw}
                activeTimeEntry={this.props.activeTimeEntry}
                removeStopwatch={this.props.removeStopwatch}
                setActiveTimeEntry={this.props.setActiveTimeEntry}
              />
            ))}
      </div>
    );
  }
}

export default StopwatchList;

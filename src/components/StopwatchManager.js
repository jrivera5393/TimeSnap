/* jshint esversion: 6 */

import React from "react";
import PropTypes from "prop-types";
import StopwatchList from "./StopwatchList";

class StopwatchManager extends React.Component {
  static propTypes = {
    activeTimeEntry: PropTypes.string,
    stopwatches: PropTypes.array,
    setActiveTimeEntry: PropTypes.func,
    addStopwatch: PropTypes.func,
    removeStopwatch: PropTypes.func
  };

  render() {
    return (
      <React.Fragment>
        <div
          id="btnAddStopwatch"
          className="row z-depth-3 valign-wrapper hoverable"
          onClick={this.props.addStopwatch}
        >
          <div className="col s8">
            <p>Press the ADD button to create a new timer.</p>
          </div>
          <div className="col s4 center-align">
            <a
              href="#"
              className="btn-floating btn-large waves-effect waves-light cyan pulse"
            >
              <i className="fa fa-plus" />
            </a>
          </div>
        </div>
        <StopwatchList
          activeTimeEntry={this.props.activeTimeEntry}
          stopwatches={this.props.stopwatches}
          removeStopwatch={this.props.removeStopwatch}
          setActiveTimeEntry={this.props.setActiveTimeEntry}
        />
      </React.Fragment>
    );
  }
}

export default StopwatchManager;

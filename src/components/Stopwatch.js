/* jshint esversion: 6 */

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Clock from "./Clock";
import ClockContainer from "./ClockContainer";
import ClockButton from "./ClockButton";
import { formattedToMilliseconds } from "../helpers";

class Stopwatch extends React.Component {
  btnStartRef = React.createRef();
  btnPauseRef = React.createRef();
  btnResetRef = React.createRef();
  clockRef = React.createRef();
  clockContainerRef = React.createRef();
  clockDigitsRef = React.createRef();

  state = {
    timeEntryId: this.props.timeEntry.timeEntryId,
    beginingTimestamp: this.props.timeEntry.beginingTimestamp || 0,
    runningTime: this.props.timeEntry.runningTime || 0,
    updateDate: this.props.timeEntry.updateDate || 0,
    digits: this.props.digits || "0:00:00.0",
    running: this.props.running || false,
    interval: null,
    inactive: false
  };

  static propTypes = {
    timeEntry: PropTypes.shape({
      timeEntryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      beginingTimestamp: PropTypes.number,
      runningTime: PropTypes.number,
      updateDate: PropTypes.number
    }),
    digits: PropTypes.string,
    running: PropTypes.bool
  };

  start = () => {
    this.setState({ running: true });

    // Prevent multiple intervals going on at the same time.
    clearInterval(this.state.interval);

    let startTimestamp = new Date().getTime(),
      runningTime = 0;

    this.setState({ beginingTimestamp: startTimestamp });

    // The app remembers for how long the previous session was running.
    if (Number(this.state.runningTime)) {
      runningTime = Number(this.state.runningTime);
    } else {
      runningTime = 1;
      this.setState({ runningTime: runningTime });
    }

    // Every 100ms recalculate the running time, the formula is:
    // time = now - when you last started the clock + the previous running time
    let interval = setInterval(
      () => this.tick(startTimestamp, runningTime),
      100
    );

    //Assign the interval to the state
    this.setState({ interval });

    this.props.setActiveTimeEntry(this.state.timeEntryId);
    //console.log(`Active TimeEntryId ${this.state.timeEntryId}`);
  };

  tick = (startTimestamp, runningTime) => {
    let stopwatchTime = new Date().getTime() - startTimestamp + runningTime;
    //Update digits on html
    this.clockDigitsRef.value.innerHTML = formattedToMilliseconds(
      stopwatchTime
    );
  };

  pause = clearActiveEntry => {
    this.setState({ running: false });

    // Stop the interval.
    clearInterval(this.state.interval);

    if (Number(this.state.beginingTimestamp)) {
      // On pause recalculate the running time.
      // new running time = previous running time + now - the last time we started the clock.
      let runningTime =
        Number(this.state.runningTime) +
        new Date().getTime() -
        Number(this.state.beginingTimestamp);

      this.setState({ beginingTimestamp: 0, runningTime });
    }
  };

  reset = () => {
    this.clockContainerRef.value.classList.remove("scale-in");
    setTimeout(() => {
      clearInterval(this.state.interval);

      this.clockDigitsRef.value.innerHTML = formattedToMilliseconds(0);

      this.setState({
        beginingTimestamp: 0,
        runningTime: 0
      });

      //Temp Code in reset
      this.props.removeStopwatch(this.state.timeEntryId);
    }, 200);
  };

  onClickStart = () => {
    if (!this.state.running) {
      this.start();
      this.btnStartRef.value.classList.add("hide");
      this.btnPauseRef.value.classList.remove("hide");
    }
  };

  onClickPause = () => {
    this.pause();
    this.btnStartRef.value.classList.remove("hide");
    this.btnPauseRef.value.classList.add("hide");
  };

  onClickReset = () => {
    this.reset();
    this.btnStartRef.value.classList.remove("hide");
    this.btnPauseRef.value.classList.add("hide");
  };

  onClickClock = () => {
    if (!this.state.running) {
      this.onClickStart();
    } else {
      this.onClickPause();
    }
  };

  ContainerMouseEnter = () => {
    this.clockContainerRef.value.classList.remove("blur");
    this.clockContainerRef.value.classList.add("animated", "pulse");
  };

  ContainerMouseLeave = () => {
    this.clockContainerRef.value.classList.add("blur");
    this.clockContainerRef.value.classList.remove("animated", "pulse");
  };

  componentDidMount() {
    // Checks if the previous session was ended while the stopwatch was running.
    // If so start it again with according time.
    if (
      Number(this.state.beginingTimestamp) &&
      Number(this.state.runningTime)
    ) {
      let runningTime =
        Number(this.state.runningTime) +
        new Date().getTime() -
        Number(this.state.beginingTimestamp);

      this.setState({ runningTime });
      this.onClickStart();
    }

    setTimeout(
      () => this.clockContainerRef.value.classList.add("scale-in"),
      100
    );
  }

  componentWillReceiveProps(props) {
    if (
      props.activeTimeEntry !== this.state.timeEntryId &&
      this.state.running
    ) {
      this.onClickPause();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    let controlCss = classNames(
      "btn-floating",
      "btn-large",
      "waves-effect",
      "waves-light"
    );
    let startCss = controlCss + " green";
    let pauseCss = controlCss + " cyan hide";
    let resetCss = controlCss + " red";
    const controlsStyle = {
      marginRight: "6%"
    };

    let active =
      this.state.running ||
      this.props.activeTimeEntry === this.state.timeEntryId;

    return (
      <ClockContainer
        id={this.state.timeEntryId}
        key={this.state.timeEntryId}
        elementRef={this.clockContainerRef}
        onMouseEnter={active ? null : this.ContainerMouseEnter}
        onMouseLeave={active ? null : this.ContainerMouseLeave}
        running={active}
      >
        <Clock
          clockRef={this.clockRef}
          digitsRef={this.clockDigitsRef}
          running={active}
        >
          {this.state.digits}
        </Clock>
        <div className="col s4 clock-controls right-align">
          <ClockButton
            elementRef={this.btnStartRef}
            onClick={this.onClickStart}
            style={controlsStyle}
            className={startCss}
            iconClass="fa fa-play"
          />
          <ClockButton
            elementRef={this.btnPauseRef}
            onClick={this.onClickPause}
            style={controlsStyle}
            className={pauseCss}
            iconClass="fa fa-pause"
          />
          <ClockButton
            elementRef={this.btnResetRef}
            onClick={this.onClickReset}
            className={resetCss}
            iconClass="fa fa-square"
          />
        </div>
      </ClockContainer>
    );
  }
}

export default Stopwatch;

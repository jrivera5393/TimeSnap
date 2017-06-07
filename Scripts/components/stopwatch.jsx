/* jshint esversion: 6 */

import React from 'react';
import {render} from 'react-dom';
import axios from "axios";

const controlsStyle = {
  marginRight: '6%'  
};

class StopwatchComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        storageId : props.storageId || 0,
        beginingTimestamp : props.beginingTimestamp || 0,
        runningTime : props.runningTime || 0,
        timeEntryId : props.timeEntryId
    };

    this.onClickStart = this.onClickStart.bind(this);
    this.onClickPause = this.onClickPause.bind(this);
    this.onClickReset = this.onClickReset.bind(this);
    this.onClickClock = this.onClickClock.bind(this);
    
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    this._start = this._start.bind(this);
    this._pause = this._pause.bind(this);
    this._reset = this._reset.bind(this);    
  }

  _start(){
        // Prevent multiple intervals going on at the same time.
        clearInterval(this.interval);
        
        let clock = this.refs.clock;
        let digits = this.refs.digits;
        let startTimestamp = new Date().getTime(), runningTime = 0;

        this.state.beginingTimestamp = startTimestamp;

        // The app remembers for how long the previous session was running.
        if(Number(this.state.runningTime)){
            runningTime = Number(this.state.runningTime);
        }
        else{
            this.state.runningTime = 1;
        }

        // Every 100ms recalculate the running time, the formula is:
        // time = now - when you last started the clock + the previous running time
        this.interval = setInterval(() => {
            let stopwatchTime = (new Date().getTime() - startTimestamp + runningTime);
            this.refs.digits.innerHTML = this._returnFormattedToMilliseconds(stopwatchTime);
        }, 100);

        clock.classList.remove('inactive');

        localStorage.setItem(this.state.storageId, JSON.stringify(this.state));

        let objTime = this._returnTimeObject(this.state.runningTime);
        let data = Object.assign({}, this.state, objTime);        

        axios.patch(`api/TimeEntry/${this.state.timeEntryId}`, data)
        .catch((error) => console.log(error));
    }

    _pause(){
        // Stop the interval.
        clearInterval(this.interval);

        if(Number(this.state.beginingTimestamp)){
            // On pause recalculate the running time.
            // new running time = previous running time + now - the last time we started the clock.
            let runningTime = Number(this.state.runningTime) + new Date().getTime() - Number(this.state.beginingTimestamp);

            this.state.beginingTimestamp = 0;
            this.state.runningTime = runningTime;

            this.refs.clock.classList.add('inactive');            
        }

        localStorage.setItem(this.state.storageId, JSON.stringify(this.state));
        
        let objTime = this._returnTimeObject(this.state.runningTime);
        let data = Object.assign({}, this.state, objTime);        

        axios.patch(`api/TimeEntry/${this.state.timeEntryId}`, data)
        .catch((error) => console.log(error));
    }

    _reset(){
        clearInterval(this.interval);
        let digits = this.refs.digits;
        let clock = this.refs.clock;

        digits.innerHTML = this._returnFormattedToMilliseconds(0);
        this.state.beginingTimestamp = 0;
        this.state.runningTime = 0;

        clock.classList.add('inactive');

        localStorage.setItem(this.state.storageId, JSON.stringify(this.state));
    }

    _returnFormattedToMilliseconds(time){
        let milliseconds = Math.floor((time % 1000) / 100),
            seconds = Math.floor((time/1000) % 60),
            minutes = Math.floor((time/(1000*60)) % 60),
            hours = Math.floor((time/(1000*60*60)) % 24);

        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    _returnTimeObject(time){
    
        let result = {
            milliseconds : Math.floor((time % 1000) / 100),
            seconds : Math.floor((time/1000) % 60),
            minutes : Math.floor((time/(1000*60)) % 60),
            hours : Math.floor((time/(1000*60*60)) % 24)
        };

        return result;
    }   

    onClickStart(){

        if(this.refs.clock.classList.contains('inactive')){
            this._start();
        }
              
        this.refs.btnStart.classList.add("hide");
        this.refs.btnPause.classList.remove("hide");
    }

    onClickPause(){
        this._pause();
        this.refs.btnStart.classList.remove("hide");
        this.refs.btnPause.classList.add("hide");
    }

    onClickReset(){
        this._reset();
        this.refs.btnStart.classList.remove("hide");
        this.refs.btnPause.classList.add("hide");
    }

    onClickClock(){        
        if(this.refs.clock.classList.contains('inactive')){
            this.onClickStart(); 
        }else{
            this.onClickPause();                    
        }
    }

    onMouseEnter(){        
        this.refs.clock.classList.add("z-depth-3");               
    }

    onMouseLeave(){        
        this.refs.clock.classList.remove("z-depth-3");
    }

    componentDidMount() {
        // Checks if the previous session was ended while the stopwatch was running.
        // If so start it again with according time.
        if(Number(this.state.beginingTimestamp) && Number(this.state.runningTime)){

            let runningTime = Number(this.state.runningTime) + new Date().getTime() - Number(this.state.beginingTimestamp);

            this.state.runningTime = runningTime;
            this._start();
        }

        setTimeout(() => this.refs.stopwatchContainer.classList.add("scale-in"), 500);        
    }

    render() {
        return (
            <div ref='stopwatchContainer' id={this.state.storageId} className="row valign-wrapper scale-transition scale-out">
                <div ref='clock' className="col s8 clock inactive center-align " onClick={this.onClickClock} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                    <span ref='digits'>{this.state.runningTime ? this._returnFormattedToMilliseconds(this.state.runningTime) :  "0:00:00.0"}</span>                
                </div>
                <div className="col s4 clock-controls right-align">
                    <a ref='btnStart' onClick={this.onClickStart} style={controlsStyle} className="btn-floating btn-large waves-effect waves-light green"><i className="fa fa-play"></i></a>
                    <a ref='btnPause' onClick={this.onClickPause} style={controlsStyle} className="btn-floating btn-large waves-effect waves-light cyan hide"><i className="fa fa-pause"></i></a>
                    <a onClick={this.onClickReset} className="btn-floating btn-large waves-effect waves-light red"><i className="fa fa-square"></i></a>
                </div>
            </div>
        );
    }
}

export default StopwatchComponent;
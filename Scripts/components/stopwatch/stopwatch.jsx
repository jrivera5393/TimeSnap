/* jshint esversion: 6 */

import React from 'react';
import axios from "axios";
import classNames from "classnames";
import * as constants from "../../common/constants.js";

const controlsStyle = {
  marginRight: '6%'  
};

function ClockContainer(props) {   
    
    let containerCss = classNames('row', 'valign-wrapper', 'scale-transition', 'scale-out', props.className);
    return (  
        <div id={props.id} href={`#${props.id}`} ref={props.containerRef} className={containerCss} onClick={props.onClick} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
            {props.children}
        </div> 
    );
}

function ClockDigits(props){
    return (
        <div ref={props.clockRef} className="col s8 clock inactive center-align" >
            <span ref={props.digitsRef}>{props.children}</span>                
        </div>        
    );
}

function ClockControl(props){
    return (
        <a ref={props.elementRef} onClick={props.onClick} style={props.style} className={props.className}><i className={props.icon}></i></a>       
    );
}

function FormattedToMilliseconds(time){
    let milliseconds = Math.floor((time % 1000) / 100),
        seconds = Math.floor((time/1000) % 60),
        minutes = Math.floor((time/(1000*60)) % 60),
        hours = Math.floor((time/(1000*60*60)) % 24);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function FormattedTimeObject(time){

    let result = {
        milliseconds : Math.floor((time % 1000) / 100),
        seconds : Math.floor((time/1000) % 60),
        minutes : Math.floor((time/(1000*60)) % 60),
        hours : Math.floor((time/(1000*60*60)) % 24)
    };

    return result;
}

class StopwatchComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            storageId : props.timeEntry.storageId || 0,
            beginingTimestamp : props.timeEntry.beginingTimestamp || 0,
            runningTime : props.timeEntry.runningTime || 0,
            timeEntryId : props.timeEntry.timeEntryId || 0,
            updateDate : props.timeEntry.updateDate,
            digits : "0:00:00.0"
        };

        this.onClickStart = this.onClickStart.bind(this);
        this.onClickPause = this.onClickPause.bind(this);
        this.onClickReset = this.onClickReset.bind(this);
        this.onClickClock = this.onClickClock.bind(this); 

        this._start = this._start.bind(this);
        this._pause = this._pause.bind(this);
        this._reset = this._reset.bind(this);
        this._updateDB = this._updateDB.bind(this);    
    }  

    _start(){
        this.clockContainer.classList.add("z-depth-5");
        // Prevent multiple intervals going on at the same time.
        clearInterval(this.interval);   
    
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
        this.interval = setInterval(() => this.tick(startTimestamp, runningTime), 100);

        this.clock.classList.remove('inactive');

        this.props.setActiveTimeEntry(this.state.timeEntryId);

        this._updateDB();       
    }

    tick(startTimestamp, runningTime){
        let stopwatchTime = (new Date().getTime() - startTimestamp + runningTime);
        this.digits.innerHTML = FormattedToMilliseconds(stopwatchTime);
        // this.setState({
        //     digits: this._returnFormattedToMilliseconds(stopwatchTime)
        // });        
    }

    _pause(){
        this.clockContainer.classList.remove("z-depth-5");

        // Stop the interval.
        clearInterval(this.interval);

        if(Number(this.state.beginingTimestamp)){
            // On pause recalculate the running time.
            // new running time = previous running time + now - the last time we started the clock.
            let runningTime = Number(this.state.runningTime) + new Date().getTime() - Number(this.state.beginingTimestamp);

            this.state.beginingTimestamp = 0;
            this.state.runningTime = runningTime;

            this.clock.classList.add('inactive');            
        }

        this._updateDB();
    }

    _reset(){        
        this.clockContainer.classList.remove('scale-in');
        setTimeout(() => {
            clearInterval(this.interval);  

            this.digits.innerHTML = FormattedToMilliseconds(0);
            this.state.beginingTimestamp = 0;
            this.state.runningTime = 0;

            this.clock.classList.add('inactive');

            //Temp Code in reset        
            this._deleteDB();
        } , 200);        
    }

    _updateDB(){
        this.state.updateDate = Date.now();
        //Get local storage of stopwatches
        let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
        ls = ls instanceof Array ? ls : [];
        let swMap = new Map(ls);       

        //Update this stopwatches map entry
        swMap.set(this.state.storageId, Object.assign({}, swMap.get(this.state.storageId), this.state));       

        //Update local storage entry
        localStorage.setItem(constants.LOCAL_STORAGE_ID_STOPWATCHES, JSON.stringify(Array.from(swMap)));
        
        let objTime = FormattedTimeObject(this.state.runningTime);
        let data = Object.assign({}, this.state, objTime);        

        if(this.state.timeEntryId === 0){
            let postData = Object.assign({}, swMap.get(this.state.storageId), data);

            axios.post(constants.URL_TIMEENTRY_CREATE, postData)
            .then((response) => {
                this.setState({
                    timeEntryId : response.data.timeEntryId
                });
            })
            .catch((e) => window.console && console.log(`Error trying to update TimeEntry on API(${constants.URL_TIMEENTRY_UPDATE}) : ${e}`));
        }else{
            axios.patch(constants.URL_TIMEENTRY_UPDATE + this.state.timeEntryId, data)
            .catch((e) => window.console && console.log(`Error trying to update TimeEntry on API(${constants.URL_TIMEENTRY_UPDATE}) : ${e}`));
        }
    }

    _deleteDB(){
        //Get local storage of stopwatches
        let ls = JSON.parse(localStorage.getItem(constants.LOCAL_STORAGE_ID_STOPWATCHES));
        ls = ls instanceof Array ? ls : [];
        let swMap = new Map(ls);       

        if(this.state.timeEntryId === 0){        
            swMap.delete(this.state.storageId);
            localStorage.setItem(constants.LOCAL_STORAGE_ID_STOPWATCHES, JSON.stringify(Array.from(swMap)));
            this.props.removeStopwatch(this.state.storageId);                    
        }else{
            axios.delete(constants.URL_TIMEENTRY_DELETE + this.state.timeEntryId)
            .then(() => {            
                swMap.delete(this.state.storageId);
                localStorage.setItem(constants.LOCAL_STORAGE_ID_STOPWATCHES, JSON.stringify(Array.from(swMap)));
                this.props.removeStopwatch(this.state.storageId);                            
            })
            .catch((e) => {
                console.log(`Error trying to update TimeEntry on API(${constants.URL_TIMEENTRY_UPDATE}) : ${e}`);            
            }); 
        }               
    }      

    onClickStart(){

        if(this.clock.classList.contains('inactive')){
            this._start();
        }
                
        this.btnStart.classList.add("hide");
        this.btnPause.classList.remove("hide");
    }

    onClickPause(){
        this._pause();
        this.btnStart.classList.remove("hide");
        this.btnPause.classList.add("hide");
    }

    onClickReset(){
        this._reset();
        this.btnStart.classList.remove("hide");
        this.btnPause.classList.add("hide");
    }

    onClickClock(){        
        if(this.clock.classList.contains('inactive')){
            this.onClickStart(); 
        }else{
            this.onClickPause();                    
        }
    }

    // onMouseEnter(){        
    //     this.clockContainer.classList.add("z-depth-3");               
    // }

    // onMouseLeave(){        
    //     this.clockContainer.classList.remove("z-depth-3");
    // }    

    componentDidMount() {
        // Checks if the previous session was ended while the stopwatch was running.
        // If so start it again with according time.
        if(Number(this.state.beginingTimestamp) && Number(this.state.runningTime)){

            let runningTime = Number(this.state.runningTime) + new Date().getTime() - Number(this.state.beginingTimestamp);

            this.state.runningTime = runningTime;
            // this._start();
            // this.btnStart.classList.add("hide");
            // this.btnPause.classList.remove("hide");
            this.onClickStart();
        }

        setTimeout(() => this.clockContainer.classList.add("scale-in"), 100);        
    }

    componentWillReceiveProps(props){
        if(props.activeTimeEntry != this.state.timeEntryId){
            this.onClickPause();
        }        
    } 

    componentWillUnmount() {
        clearInterval(this.interval);        
    }

    render(){   

        let controlCss = classNames('btn-floating', 'btn-large', 'waves-effect', 'waves-light');
        let startCss = controlCss + ' green';
        let pauseCss = controlCss + ' cyan hide';
        let resetCss = controlCss + ' red';

        return(
            <ClockContainer id={this.props.id} key={this.state.timeEntryId} containerRef={e => this.clockContainer = e}>
                <ClockDigits clockRef={e => this.clock = e} digitsRef={e => this.digits = e}>
                    {this.state.digits}
                </ ClockDigits>
                <div className="col s4 clock-controls right-align">
                    <ClockControl elementRef={e => this.btnStart = e} onClick={this.onClickStart.bind(this)} style={controlsStyle} className={startCss} icon="fa fa-play" />
                    <ClockControl elementRef={e => this.btnPause = e} onClick={this.onClickPause.bind(this)} style={controlsStyle} className={pauseCss} icon="fa fa-pause" />
                    <ClockControl elementRef={e => this.btnReset = e} onClick={this.onClickReset.bind(this)} className={resetCss} icon="fa fa-square" />                    
                </div>            
            </ClockContainer>
        );        
    }
}

export default StopwatchComponent;
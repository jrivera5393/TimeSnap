/* jshint esversion: 6 */

import React from 'react';
import {render} from 'react-dom';
import StopwatchListComponent from './stopwatch-list.jsx';
import axios from "axios";

class AddStopwatchComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        numStopwatch : 0
    };    
    this._onAdd = this._onAdd.bind(this);
  }

  _onAdd (evt) {
      
    let data = {
        StorageId : "sw" + new Date().getDate() + new Date().getTime(),
        ProjectId : 1           
    };       

    axios.post('api/TimeEntry', data)
    .then((response) => {
        this.setState({
            numStopwatch : this.state.numStopwatch + 1
        });
    })
        .catch((err) => alert('Something went wrong :(' + err));
    
  }

  render() {

    return (
        <div>
            <div id="btnAddStopwatch" className="row z-depth-3 valign-wrapper hoverable" onClick={this._onAdd}>
                <div className="col s8">
                    <p>
                        Press the ADD button to create a new timer.
                    </p>
                </div>
                <div className="col s4 center-align">
                    <a href="#" className="btn-floating btn-large waves-effect waves-light cyan pulse"><i className="fa fa-plus"></i></a>
                </div>                
            </div>
            <div>
                  <StopwatchListComponent/>        
            </div>
        </div>                
    );
  }

}

render(<AddStopwatchComponent />, document.getElementById('add-stopwatch'));

export default AddStopwatchComponent;
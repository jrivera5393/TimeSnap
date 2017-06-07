import React from 'react';
import {render} from 'react-dom';
import StopwatchComponent from './stopwatch.jsx';
import axios from "axios";

class StopwatchListComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {stopwatches : []};    
  }

  componentDidMount() {
    axios.get("api/TimeEntry")
    .then((response) => {        
        this.setState({stopwatches: response.data});
    });
  }  

  render() {  
    return (
        <div>
            {this.state.stopwatches.map(sw =>
                <StopwatchComponent timeEntryId={sw.timeEntryId} storageId={sw.storageId} beginingTimestamp={sw.beginingTimestamp} runningTime={sw.runningTime}/>
            )}
        </div>                
    );
  }

}

// render(<StopwatchListComponent />, document.getElementById('stopwatch-list'));

export default StopwatchListComponent;
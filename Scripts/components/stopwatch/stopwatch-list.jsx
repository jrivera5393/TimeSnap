/* jshint esversion: 6 */

import React from 'react';
import StopwatchComponent from './stopwatch.jsx';

class StopwatchListComponent extends React.Component {

  constructor(props) {
    super(props);    
  }  

  render() {
    return (
      <div id="stopwatch-list">
        {
          this.props.stopwatches.map((sw) =>          
             <StopwatchComponent
                activeTimeEntry={this.props.activeTimeEntry}
                id={`${sw.timeEntryId}${sw.storageId}`} 
                key={`te${sw.timeEntryId}`}
                timeEntry={sw}                
                removeStopwatch={this.props.removeStopwatch.bind(this)}
                setActiveTimeEntry={this.props.setActiveTimeEntry.bind(this)}>
            </StopwatchComponent>                                          
        )} 
      </div>                           
    );
  }

}

export default StopwatchListComponent;
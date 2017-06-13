/* jshint esversion: 6 */

import React from 'react';
import TaskComponent from './task.jsx';

class TaskListComponent extends React.Component {

    constructor(props) {
        super(props);    
    }

    componentDidMount(){
        setTimeout(() => this.ul.classList.add("scale-in"), 100);
    }

    componentDidUpdate(){
        if(this.props.tasks.length > 0){
            this.ul.classList.add("scale-in");
        }else{
            this.ul.classList.remove("scale-in");
        }
    } 

    render() {
        return (
            <ul ref={(e) => this.ul = e} id="ulTaskList" className="collection scale-transition scale-out">
                {
                    this.props.tasks.map((t) =>            
                        <TaskComponent
                            id={`t${t.taskId}`} 
                            key={`t${t.taskId}`} 
                            description={t.description}                
                            removeTask={this.props.removeTask.bind(this)}>
                        </TaskComponent>                                      
                    )
                } 
            </ul>                           
        );
    }

}

export default TaskListComponent;
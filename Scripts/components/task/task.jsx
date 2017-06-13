/* jshint esversion: 6 */

import React from 'react';

class TaskComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            taskId : props.taskId || 0,
            description : props.description || "<< Empty >>"
        };

        this.onDelete = this.onDelete.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseEnter(){
        this.btnDelete.classList.add("scale-in");
    }

    onMouseLeave(){
        this.btnDelete.classList.remove("scale-in");
    }

    onDelete(){
        this.li.classList.remove("scale-in");
        this.props.removeTask(this.state.taskId);
    }    

    componentDidMount(){
        setTimeout(() => this.li.classList.add("scale-in"), 100);
    }

    render(){
        return(
            <li ref={(e) => this.li = e} id={this.state.taskId} className='collection-item scale-transition scale-out' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className='collection-item-wrapper'>
                    <i className='fa fa-terminal'></i> {this.state.description}
                    <a ref={(e) => this.btnDelete = e} onClick={this.onDelete} className='scale-transition scale-out waves-effect waves-circle btn-floating secondary-content red'><i className='fa fa-trash-o'></i></a>
                </div>
            </li>
        );
    }
}

export default TaskComponent;
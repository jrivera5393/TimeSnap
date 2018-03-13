/* jshint esversion: 6 */

import React from "react";
import { default as swal } from "sweetalert2";

class Task extends React.Component {
  btnSettingsRef = React.createRef();
  liRef = React.createRef();
  inputRef = React.createRef();

  state = {
    taskId: this.props.task.taskId || 0,
    description: this.props.task.description || "<< Empty >>"
  };

  onMouseEnter = () => {
    this.btnSettingsRef.value.classList.add("scale-in");
  };

  onMouseLeave = () => {
    this.btnSettingsRef.value.classList.remove("scale-in");
  };

  onEdit = () => {
    swal({
      html: `<div class="row">
                        <div class="input-field col s12">                                
                            <textarea id="editTaskDescription" class="materialize-textarea" maxlength="120" data-length="120">${
                              this.state.description
                            }</textarea>
                            <label for="editTaskDescription">Task Description</label>
                        </div>                            
                    </div>`,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: `<i class="fa fa-save"></i>  Save`,
      confirmButtonClass: "waves-effect waves-light z-depth-4 btn green",
      cancelButtonText: `<i class="fa fa-close"></i>  Cancel`,
      cancelButtonClass: "waves-effect waves-light z-depth-4 btn red",
      buttonsStyling: false,
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          const desc = document.getElementById("editTaskDescription");
          if (desc.value) {
            resolve(desc.value);
            this.setState({
              description: desc.value
            });
          } else {
            reject("You need to provide a task description.");
          }
        });
      },
      onOpen: () => {
        const descInput = document.getElementById("editTaskDescription");
        descInput.focus();
        // descInput.characterCounter();
      }
    }).then(
      result => {
        swal({
          type: "success",
          html: "The change has been saved."
        });
      },
      dismiss => {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === "cancel") {
          swal("Cancelled", "No changes were made.", "error");
        }
      }
    );
  };

  onDelete = () => {
    this.liRef.value.classList.add("animated", "zoomOutLeft");
    setTimeout(() => {
      this.liRef.value.classList.remove("scale-in");
      this.props.removeTask(this.state.taskId);
    }, 600);
  };

  componentDidMount() {
    setTimeout(() => this.liRef.value.classList.add("scale-in"), 100);
  }

  render() {
    return (
      <li
        ref={this.liRef}
        className="collection-item valign-wrapper scale-transition scale-out"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <i className="fa fa-angle-double-right" /> {this.state.description}
        <div
          ref={this.btnSettingsRef}
          className="overlay valign-wrapper scale-transition scale-out"
        >
          <div className="fixed-action-btn relative horizontal">
            <a className="waves-effect waves-circle btn-floating grey darken-2">
              <i className="fa fa-cog" />
            </a>
            <ul>
              <li>
                <a
                  onClick={this.onEdit}
                  className="btn-floating yellow darken-1"
                >
                  <i className="fa fa-edit" />
                </a>
              </li>
              <li>
                <a onClick={this.onDelete} className="btn-floating red">
                  <i className="fa fa-trash-o" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

export default Task;

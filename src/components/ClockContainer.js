import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

//Stateless functional components
const ClockContainer = props => {
  let containerCss = classNames(
    "row",
    "valign-wrapper",
    "scale-transition",
    "scale-out",
    "scale-in",
    "animated",
    props.running ? "pulse" : "blur",
    props.className
  );
  return (
    <div
      id={props.id}
      href={`#${props.id}`}
      ref={props.elementRef}
      className={containerCss}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </div>
  );
};

//PropTypes must be after function when the component is created using Stateless functional components
ClockContainer.propTypes = {
  id: PropTypes.any.isRequired,
  elementRef: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.any,
  running: PropTypes.bool
};

export default ClockContainer;

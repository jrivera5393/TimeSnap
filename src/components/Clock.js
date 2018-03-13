import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Clock = props => {
  const { className, clockRef, digitsRef, children, overwriteCss } = props;
  let containerCss =
    overwriteCss === true
      ? classNames("clock", props.running ? "" : "inactive", className)
      : classNames(
          "col",
          "s8",
          "clock",
          props.running ? "" : "inactive",
          "center-align",
          className
        );

  return (
    <div ref={clockRef} className={containerCss}>
      <span ref={digitsRef}>{children}</span>
    </div>
  );
};

Clock.propTypes = {
  clockRef: PropTypes.any.isRequired,
  digitsRef: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  overwriteCss: PropTypes.bool,
  running: PropTypes.bool.isRequired
};

export default Clock;

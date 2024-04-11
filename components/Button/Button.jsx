import React from "react";

//INTERNAL IMPORT
import Style from "./Button.module.css";

const Button = ({ btnName, handleClick, icon, classStyle }) => {
  return (
    <div className={Style.box}>
      <button
        className={`${Style.button} ${classStyle}`}
        onClick={() => {
          console.log("Button Clicked!"); // Add this line
          handleClick();
        }}>
        {icon} {btnName}
      </button>
    </div>
  );
};

export default Button;

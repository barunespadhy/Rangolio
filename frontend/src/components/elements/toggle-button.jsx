import React from "react";
function ToggleButton(props){
    return (
        <>
          <label className="custom-toggle" onClick={props.themeSwitcher}>
            <input type="checkbox" id={props.Id} onChange={props.ThemeSwitcher}/>
            <span className="custom-toggle-slider rounded-circle" />
          </label>
          <span className="clearfix" />
        </>
      );
}

export default ToggleButton;
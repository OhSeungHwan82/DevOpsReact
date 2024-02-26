import React  from "react";
// import {SyncLoader} from "react-spinners";
// import {Oval, Hearts, Grid, TailSpin} from "react-loader-spinner"
import {Oval} from "react-loader-spinner"
const Loading1 =() => {
    return (
        <div
        style={
            {
                position : "fixed",
                top : "50%",
                left : "50%",
                transform : "translate(-50%, -50%)"
            }
        }>

            <Oval
            color="#ff0000" 
            height={100} 
            width={100}
            />
        </div>
    )
}

export default Loading1;
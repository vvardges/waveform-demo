import React, {useReducer, useState} from 'react';
import {Wave} from "./Wave";
import { SketchPicker } from 'react-color';

export function WaveForm(props) {
    // Declare a new state variable, which we'll call "count"
    const {data, delta} = props;

    const [colors, dispatch] = useReducer((colors, { item, value }) => {
        const newColors = [...colors];
        newColors[item] = value;
        return newColors;
    }, [{r:255, g:228, b:190, a:0.5},{r:240, g:151, b:178, a:0.5},{r:118, g:161, b:196, a:0.5}]);

    return (
        <React.Fragment>
            {[0,1,2].map(item =>
                <div className="flex" key={item}>
                <div className="panel" >
                    <svg>
                        <Wave color={`rgba(${Object.values(colors[item]).join(",")})`} delta={delta} points={data[item].filteredData}/>
                    </svg>
                    <code>{data[item].timePoints.join(", ")}</code>
                </div>
                <SketchPicker color={colors[item]} onChangeComplete={color => dispatch({ item, value: color.rgb})}/>
                </div>
            )}
            <div className="flex">
                <div className="panel">
                    <svg>
                        <Wave color={`rgba(${Object.values(colors[0]).join(",")})`} delta={delta} points={data[0].filteredData}/>
                        <Wave color={`rgba(${Object.values(colors[1]).join(",")})`} delta={delta} points={data[1].filteredData}/>
                        <Wave color={`rgba(${Object.values(colors[2]).join(",")})`} delta={delta} points={data[2].filteredData}/>
                    </svg>
                </div>
            </div>

        </React.Fragment>
    );
}
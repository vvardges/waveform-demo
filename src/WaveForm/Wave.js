import React from 'react';

export function Wave(props) {
    const {color, delta, points} = props;

    const complexArray = [];
    for (let i = 0; i < points.length; i++) {
        const y = (delta[1] + points[i]*50+1);
        if(isNaN(y)) continue;
        complexArray.push(i*27 + "," + (delta[1] + points[i]*50+1));
    }
    for (let i = points.length - 2; i > 0; i--) {
        const y = (delta[1] - points[i]*50);
        if(isNaN(y)) continue;
        complexArray.push(i*27 + "," + y);
    }
    const pointsStr = complexArray.join(" ");

    return (
        <polygon
            fill={color}
            points={pointsStr}
        />
    )
}
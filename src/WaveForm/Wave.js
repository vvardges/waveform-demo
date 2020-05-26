import React from 'react';

export function Wave(props) {
    const {color, delta, points} = props;

    const complexArray = [];
    for (let i = 0; i < points.length; i++) {
        complexArray.push(i*7 + "," + (delta[1] + points[i]*50+1));
    }
    for (let i = points.length - 2; i > 0; i--) {
        complexArray.push(i*7 + "," + (delta[1] - points[i]*50));
    }
    const pointsStr = complexArray.join(" ");

    return (
        <polygon
            fill={color}
            points={pointsStr}
        />
    )
}
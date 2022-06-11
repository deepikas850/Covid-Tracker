import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Infobox.css";

function Infobox( {title, cases, total, isRed, active, ...props}) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"} 
            ${isRed && "infoBox--red"}`}>
                <CardContent>
                    <Typography className color="textSecondary">
                        {title}
                    </Typography>
                    <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>
                        {cases}
                    </h2>
                    <Typography className="infoBox_total" color="textSecondary">
                        {total} Total
                    </Typography>
                </CardContent>
        </Card>
    )
}

export default Infobox

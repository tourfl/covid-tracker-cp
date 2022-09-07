import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@mui/material";

function InfoBox({ title, cases, total, active, color = "green", ...props }) {
    return (
        <Card
            className={`infoBox ${active && `infoBox--${color}`}`}
            onClick={props.onClick}
        >
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className="infoBox__cases">{cases}</h2>
                <Typography color="textSecondary" className="infoBox__total">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;

import React, { PureComponent } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import MainPage from "./Pages/Main";
import RegisterPage from "./Pages/Register";
import LoginPage from "./Pages/Login";
import AssignmentListPage from "./Pages/AssignmentList";
import LecutrePage from "./Pages/Lecture";
import LecutreStudentPage from "./Pages/LectureStudent";
import AssignmentListPro from "./Pages/AssignmentListPro";

import "./index.scss";

const App = (props) => {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={MainPage} /> //
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/lecture" component={LecutrePage} />
                    <Route exact path="/lectureStudent" component={LecutreStudentPage} />
                    <Route exact path="/assignmentList" component={AssignmentListPage} />
                    <Route exact path="/assignmentListPro" component={AssignmentListPro} />
                </Switch>
            </BrowserRouter>
        </React.Fragment>
    );
};

export default App;

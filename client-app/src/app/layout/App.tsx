import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import NavBar from "../../features/nav/NavBar";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
    return (
        <Fragment>
            <Route exact path='/' component={HomePage} />
            <Route
                path={"/(.+)"}
                render={() => (
                    <Fragment>
                        <NavBar />
                        <Container style={{ marginTop: "7em" }}>
                            <Route
                                exact
                                path='/activities'
                                component={ActivityDashboard}
                            />
                            <Route
                                path='/activities/:id'
                                component={ActivityDetails}
                            />
                            <Route
                                path={["/createActivity", "/manage/:id"]}
                                component={ActivityForm}
                                key={location.key}
                            />
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default withRouter(observer(App));

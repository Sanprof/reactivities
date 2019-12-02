import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import NavBar from "../../features/Nav/NavBar";
import { LoadingComponen } from "./LoadingComponent";
import ActivityStore from "../stores/ActivityStore";
import { observer } from "mobx-react-lite";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial) {
        return <LoadingComponen content='Loading activities...' />;
    }

    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
                <ActivityDashboard />
            </Container>
        </Fragment>
    );
};

export default observer(App);

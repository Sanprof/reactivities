import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/ActivityStore";
import { RouteComponentProps } from "react-router";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history,
}) => {
    const activityStore = useContext(ActivityStore);
    const {
        submitting,
        loadActivity,
        createActivity,
        editActivity,
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then(activity => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field
                                    name='title'
                                    placeholder='Title'
                                    value={activity.title}
                                    component={TextInput as any}
                                />
                                <Field
                                    name='description'
                                    rows={3}
                                    placeholder='Description'
                                    value={activity.description}
                                    component={TextAreaInput as any}
                                />
                                <Field
                                    name='category'
                                    placeholder='Category'
                                    options={category}
                                    value={activity.category}
                                    component={SelectInput as any}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        name='date'
                                        placeholder='Date'
                                        date={true}
                                        value={activity.date}
                                        component={DateInput as any}
                                    />
                                    <Field
                                        name='time'
                                        placeholder='Time'
                                        time={true}
                                        value={activity.time}
                                        component={DateInput as any}
                                    />
                                </Form.Group>
                                <Field
                                    name='city'
                                    placeholder='City'
                                    value={activity.city}
                                    component={TextInput as any}
                                />
                                <Field
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                    component={TextInput as any}
                                />
                                <Button
                                    loading={submitting}
                                    disabled={loading}
                                    floated='right'
                                    positive
                                    type='submit'
                                    content='Submit'
                                />
                                <Button
                                    onClick={() =>
                                        history.push(
                                            activity.id
                                                ? `/activities/${activity.id}`
                                                : "/activities"
                                        )
                                    }
                                    disabled={loading}
                                    floated='right'
                                    type='button'
                                    content='Cancel'
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);

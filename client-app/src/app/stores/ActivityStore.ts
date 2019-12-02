import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activityRegistry = new Map();

    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial: boolean = false;
    @observable editMode: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = "";

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction("load activities", () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("finished load activities", () => {
                this.loadingInitial = false;
            });
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction("creating activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("finished creating activity", () => {
                this.submitting = false;
            });
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction("editing activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("finished editing activity", () => {
                this.submitting = false;
            });
        }
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction("deleting activity", () => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction("finished deleting activity", () => {
                this.submitting = false;
                this.target = "";
            });
        }
    };

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    };

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    };
    @action cancelFormOpen = () => {
        this.editMode = false;
    };

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    };

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };
}

export default createContext(new ActivityStore());

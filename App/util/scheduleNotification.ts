import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { NotificationPreferenceType, ApiContext } from '../stores';
import { NOW, NEXT_SUNDAY } from './time';
import { useContext } from 'react';


export async function registerForPushNotificationsAsync(selectedPreference: NotificationPreferenceType): Promise<void> {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status
    }
    if (finalStatus == 'granted' || existingStatus == 'granted') {
        setNotificationTime(selectedPreference)
    }

}


export function scheduleNotification(selectedPreference: NotificationPreferenceType) {
    if (selectedPreference == 'None') {
        Notifications.cancelAllScheduledNotificationsAsync();
    } else {
        registerForPushNotificationsAsync(selectedPreference)
    }
}


export async function setNotificationTime(selectedPreference: NotificationPreferenceType) {

    // Cannot use it here 
    // Need a way to get current cigerattes count on every notification
    const { api } = useContext(ApiContext);

    Notifications.cancelAllScheduledNotificationsAsync();
    const notification = {
        title: 'Shoot I smoke',
        body: 'You are smoking ' + (api ? api.shootISmoke.cigarettes : 0) + ' cigarettes per day',
        data: '',
        ios: {
            sound: true
        }
    }
    let schedulingOptions = {}
    if (selectedPreference === 'Daily') {
        // *** For testing the notification, displays a notification the next minute *****
        // schedulingOptions = {
        //     year: NOW.getFullYear(),
        //     month: NOW.getMonth(),
        //     day: NOW.getDate(),
        //     hour: NOW.getHours(),
        //     minute: NOW.getMinutes() + 1,
        //     repeat: 'day'
        // }
        schedulingOptions = {
            year: NOW.getFullYear(),
            month: NOW.getMonth(),
            day: NOW.getDate(),
            hour: 10,
            repeat: 'day'
        }
    } else if (selectedPreference === 'Weekly') {
        schedulingOptions = {
            year: NEXT_SUNDAY.getFullYear(),
            month: NEXT_SUNDAY.getMonth(),
            day: NEXT_SUNDAY.getDate(),
            hour: 10,
            repeat: 'week'
        }
    } else {
        schedulingOptions = {
            year: NOW.getFullYear(),
            month: NOW.getMonth() + 1,
            day: 1,
            hour: 10,
            repeat: 'month'
        }
    }

    await Notifications.scheduleNotificationWithCalendarAsync(notification, schedulingOptions);
}

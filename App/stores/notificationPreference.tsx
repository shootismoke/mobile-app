import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from 'react';
import { AsyncStorage } from 'react-native';

export type NotificationPreferenceType = 'None' | 'Daily' | 'Weekly' | 'Monthly';

const STORAGE_KEY = 'NOTIFICATION_PREFERENCE';

interface ContextType {
    notificationPreference: NotificationPreferenceType;
    setNotificationPreference: (selectedPreference: NotificationPreferenceType) => void;
}

const Context = createContext<ContextType>({
    notificationPreference: 'None',
    setNotificationPreference: () => { }
});

export function NotificationContextProvider({ children }: { children: ReactNode }) {
    const [notificationPreference, setNotificationPreference] = useState<NotificationPreferenceType>(
        'None'
    );

    const getNotificationPrefernce = async (): Promise<void> => {
        const preference = await AsyncStorage.getItem(STORAGE_KEY);
        if (preference === 'None' || preference === 'Weekly' || preference === 'Daily' || preference === 'Monthly') {
            setNotificationPreference(preference);
        }   
    };

    useEffect(() => {
        getNotificationPrefernce();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, notificationPreference);
    }, [notificationPreference]);

    return (
        <Context.Provider
            value={{ notificationPreference, setNotificationPreference}}
        >
            {children}
        </Context.Provider>
    );
}

export const useNotificationContext = () => useContext(Context);

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { AsyncStorage } from 'react-native';
import { i18n } from '../localization';

export type DistanceUnit = 'km' | 'mile';
type DistanceUnitFormat = 'short' | 'long';

const STORAGE_KEY = 'DISTANCE_UNIT';

interface ContextType {
  distanceUnit: DistanceUnit;
  setDistanceUnit: (distanceUnit: DistanceUnit) => void;
  localizedDistanceUnit: (format: DistanceUnitFormat) => string;
}

const Context = createContext<ContextType>({
  distanceUnit: 'km',
  localizedDistanceUnit: () => '',
  setDistanceUnit: () => {}
});

export function DistanceUnitProvider({ children }: { children: ReactNode }) {
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>(
    i18n.locale === 'en-US' ? 'mile' : 'km'
  );

  const getDistanceUnit = async (): Promise<void> => {
    const unit = await AsyncStorage.getItem(STORAGE_KEY);
    if (unit === 'km' || unit === 'mile') {
      setDistanceUnit(unit);
    }
  };

  const localizedDistanceUnit = (format: 'short' | 'long'): string =>
    distanceUnit === 'km'
      ? i18n.t(`distance_unit_${format}_km`)
      : i18n.t(`distance_unit_${format}_mi`);

  useEffect(() => {
    getDistanceUnit();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, distanceUnit);
  }, [distanceUnit]);

  return (
    <Context.Provider
      value={{ distanceUnit, setDistanceUnit, localizedDistanceUnit }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDistanceUnit = () => useContext(Context);

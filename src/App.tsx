import { useState } from 'react';
import CitySelector from './features/weather/CitySelector';
import WeatherChart from './features/weather/WeatherChart';
import styles from './App.module.scss';

export default function App() {
    const [cityId, setCityId] = useState(61); // 預設為台北

    return (
        <div className={styles.App}>
            <CitySelector onCityChange={setCityId} />
            <WeatherChart cityId={cityId} />
        </div>
    );
}

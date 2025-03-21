import { useEffect, useRef, useState } from 'react';
import TemperatureChart from './TemperatureChart';
import RainfallChart from './RainfallChart';
import styles from './WeatherChart.module.scss';

interface ClimateMonth {
    month: string;
    maxTemp: string;
    minTemp: string;
    rainfall: string;
}

interface Props {
    cityId: number;
}

export default function WeatherChart({ cityId }: Props) {
    const [data, setData] = useState<ClimateMonth[]>([]);
    const cityName = useRef<string>('');

    useEffect(() => {
        if (!cityId) return;

        fetch(`https://worldweather.wmo.int/en/json/${cityId}_en.json`)
            .then((r) => r.json())
            .then((json) => {
                setData(json.city.climate.climateMonth);
                cityName.current = json.city.cityName;
            })
            .catch(console.error);
    }, [cityId]);

    // 這裡省略 D3 繪圖邏輯（你之前已經寫好的）

    return (
        <div className={styles.wrap}>
            <p>{cityName.current}</p>
            <TemperatureChart data={data} />
            <RainfallChart data={data} />
        </div>
    );
}

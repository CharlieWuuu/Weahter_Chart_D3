import { useEffect, useState, useRef } from 'react';

interface ClimateMonth {
    month: string;
    maxTemp: string;
    minTemp: string;
    rainfall: string;
}

export function useClimateData() {
    const [data, setData] = useState<ClimateMonth[]>([]);
    const cityName = useRef<string>('');

    useEffect(() => {
        fetch('https://worldweather.wmo.int/en/json/1_en.json')
            .then((r) => r.json())
            .then((json) => {
                setData(json.city.climate.climateMonth as ClimateMonth[]);
                cityName.current = json.city.cityName;
            })
            .catch(console.error);
    }, []);

    return { data, cityName };
}

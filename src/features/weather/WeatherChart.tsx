import { useClimateData } from '../../hooks/useClimateData';
import TemperatureChart from './TemperatureChart';
import RainfallChart from './RainfallChart';

export default function WeatherChart() {
    const { data, cityName } = useClimateData();

    return (
        <div className="WeatherChart">
            <p>{cityName.current}</p>
            <TemperatureChart data={data} />
            <RainfallChart data={data} />
        </div>
    );
}

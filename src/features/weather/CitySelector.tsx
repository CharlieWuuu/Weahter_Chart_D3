import { useEffect, useState } from 'react';
import styles from './CitySelector.module.scss';

// 定義 CityInfo 型別：每個城市包含 cityId、cityName 和 countryName
interface CityInfo {
    cityId: number;
    cityName: string;
    countryName: string;
}

// 定義元件接收的 Props：外部要傳入一個 onCityChange callback
interface Props {
    onCityChange: (cityId: number) => void;
}

// 主要元件開始：接收 props（onCityChange）
export default function CitySelector({ onCityChange }: Props) {
    // cityData 是一個物件，每個 key 是國家名，value 是這個國家的城市陣列
    const [cityData, setCityData] = useState<Record<string, CityInfo[]>>({});

    // 使用者目前選擇的國家
    const [selectedCountry, setSelectedCountry] = useState('');

    // 使用者目前選擇的城市 ID（預設是 null）
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    // 在元件掛載（第一次渲染）時執行
    useEffect(() => {
        // 取得城市清單的資料（文字格式）
        fetch('https://worldweather.wmo.int/en/json/full_city_list.txt')
            .then((r) => r.text()) // 把 response 轉成純文字
            .then((text) => {
                // 按行分割
                const lines = text.trim().split('\n');

                // 準備一個結果物件：國家 ➜ 城市陣列
                const data: Record<string, CityInfo[]> = {};

                // 每一行是一筆城市資料
                for (const line of lines) {
                    // 解析這一行：切成 [countryName, cityName, cityId]
                    const [countryName, cityName, cityId] = line
                        .split(';') // 使用分號分割
                        .map((s) => s.trim().replace(/"/g, '')); // 去掉引號與空白

                    // 如果這個國家還沒有建立陣列，就先初始化
                    if (!data[countryName]) data[countryName] = [];

                    // 把這筆城市資料 push 進該國家的陣列中
                    data[countryName].push({
                        cityId: +cityId, // 轉成數字
                        cityName,
                        countryName,
                    });
                }

                // 儲存到 cityData 狀態中，觸發畫面更新
                setCityData(data);
            });
    }, []); // 只有第一次渲染時會執行這個 useEffect

    // 當使用者選擇不同的國家時觸發
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(e.target.value); // 更新所選國家
        setSelectedCityId(null); // 清空城市選擇
    };

    // 當使用者選擇城市時觸發
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityId = parseInt(e.target.value); // 將值轉成 number
        setSelectedCityId(cityId); // 更新狀態
        onCityChange(cityId); // 呼叫父層傳入的函式，把 cityId 傳出去
    };

    // JSX 畫面內容
    return (
        <div className={styles.wrapper}>
            {/* 國家下拉選單 */}
            <select value={selectedCountry} onChange={handleCountryChange}>
                <option value="" disabled hidden>
                    請選擇國家
                </option>
                {Object.keys(cityData) // 把所有國家名字取出
                    .sort() // 排序
                    .map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
            </select>

            {/* 如果已經選好國家，才顯示城市選單 */}
            {selectedCountry && (
                <select value={selectedCityId ?? ''} onChange={handleCityChange}>
                    <option value="" disabled hidden>
                        請選擇城市
                    </option>
                    {cityData[selectedCountry].map((city) => (
                        <option key={city.cityId} value={city.cityId}>
                            {city.cityName}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}

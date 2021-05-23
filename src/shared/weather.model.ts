export interface Weather {
    temp: number;
    main: string;
    icon: string;
    city: string;
    unit: string;
}

export interface WeatherDTO {
    main: { temp: number };
    name: string;
    weather: [{ main: string, icon: string }];
}
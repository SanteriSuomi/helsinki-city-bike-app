class Journey {
	departure_date: string;
	return_date: string;
	departure_station_id: number;
	departure_station_name: string;
	return_station_id: number;
	return_station_name: string;
	covered_distance: number;
	duration: number;

	constructor(journey: Journey) {
		this.departure_date = journey.departure_date;
		this.return_date = journey.return_date;
		this.departure_station_id = journey.departure_station_id;
		this.departure_station_name = journey.departure_station_name;
		this.return_station_id = journey.return_station_id;
		this.return_station_name = journey.return_station_name;
		this.covered_distance = journey.covered_distance;
		this.duration = journey.duration;
	}
}

class Station {
	id: number;
	name: string;
	address: string;
	city: string;
	operator: string;
	capacity: number;
	x: number;
	y: number;

	constructor(station: Station) {
		this.id = station.id;
		this.name = station.name;
		this.address = station.address;
		this.city = station.city;
		this.operator = station.operator;
		this.capacity = station.capacity;
		this.x = station.x;
		this.y = station.y;
	}
}

export { Journey, Station };

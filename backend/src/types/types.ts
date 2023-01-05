class DatabaseBaseObject {
	hasEmptyProperties(): boolean {
		return !Object.values(this).every(Boolean);
	}

	toArray(): any[] {
		return Object.values(this);
	}
}

class Journey extends DatabaseBaseObject {
	departure_date: string;
	return_date: string;
	departure_station_id: number;
	return_station_id: number;
	covered_distance: number;
	duration: number;

	constructor(journey: Journey) {
		super();
		this.departure_date = journey.departure_date;
		this.return_date = journey.return_date;
		this.departure_station_id = journey.departure_station_id;
		this.return_station_id = journey.return_station_id;
		this.covered_distance = journey.covered_distance;
		this.duration = journey.duration;
	}
}

class Station extends DatabaseBaseObject {
	id: number;
	name: string;
	address: string;
	city: string;
	operator: string;
	capacity: number;
	x: number;
	y: number;

	constructor(station: Station) {
		super();
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

type ValidationRule = {
	index?: number;
	isString?: boolean;
	isNumber?: boolean;
	isDate?: boolean;
	custom?: (field: string) => boolean;
};

export { Journey, Station, ValidationRule, DatabaseBaseObject };

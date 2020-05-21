import Model from './model';

class Appointment extends Model {
	constructor(date, time, provider, duration) {
		super();
		this.date = date;
		this.time = time;
		this.provider = provider;
		this.duration = duration;
	}
}

export default Appointment;

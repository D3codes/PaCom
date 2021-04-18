import Model from './model';

class Appointment extends Model {
	constructor(date, time, provider, duration, procedure) {
		super();
		this.date = date;
		this.time = time;
		this.provider = provider;
		this.duration = duration;
		this.procedure = procedure;
	}
}

export default Appointment;

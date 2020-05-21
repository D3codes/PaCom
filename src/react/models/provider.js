import Model from './model';

class Provider extends Model {
	constructor(source, target, phonetic) {
		super();
		this.source = source;
		this.target = target;
		this.phonetic = phonetic;
	}
}

export default Provider;

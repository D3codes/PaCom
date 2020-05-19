/* eslint-disable max-classes-per-file */
export class NullValueException extends Error {}

export class VersionNotFoundException extends Error {
	constructor() {
		super('Unable to find version for package');
	}
}

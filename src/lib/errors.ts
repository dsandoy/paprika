/** This module contains custom error classes */

/** Error thrown if no document is found in the database */
export class NoDocumentError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'NoDocumentError';
	}
}

/** error thrown if a parameter value is invalid */
export class ValueError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'ValueError';
	}
}

/** error thrown if an array is empty */
export class ArrayEmptyError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'ArrayEmptyError';
	}
}

/** Error raised if an object already exists when one tries to create a dublicate */
export class ObjectExists extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'ObjectExists';
	}
}

/** Error raised if a value is not found */
export class NotFoundError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

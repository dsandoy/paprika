import { NotFoundError, ValueError } from '$lib/errors';
import prisma from '$lib/prisma';
import type { Dish } from '@prisma/client';

export class ObjectCreationError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'ObjectCreationError';
	}
}

export class ObjectUpdateError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'ObjectUpdateError';
	}
}

export class InvalidOptions extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'InvalidOptions';
	}
}

export type DQOptions = {
	all?: boolean;
	where?: Partial<Dish>;
};

export class DishQueries {
	public static async create(dish: Dish) {
		if (!dish) throw new ValueError('A dish must be provided');
		try {
			const result = await prisma.dish.create({
				data: dish
			});
			if (!result) throw new ObjectCreationError('Failed to create dish');
		} catch (error) {
			throw new ObjectCreationError('Failed to create dish' + error);
		}
	}

	public static async getMany(options: DQOptions = {}, session = null): Promise<Dish[]> {
		try {
			if (!options) {
				if (session === null) throw new ValueError('Please provide a session!');

				const dishes = await prisma.dish.findMany({
					where: {
						user: session.user.email
					},
					include: {
						ingredients: true
					}
				});
				return dishes;
			}

			if (options.all) {
				const dishes: Dish[] = await prisma.dish.findMany();
				if (dishes) return dishes;

				throw new NotFoundError('Dishes not found');
			}

			if (options.where) {
				const dishes: Dish[] = await prisma.dish.findMany({
					where: options.where
				});
				if (dishes) return dishes;
				throw new NotFoundError('Dishes not found');
			} else {
				throw new InvalidOptions('please provide valid options' + options);
			}
		} catch (error) {
			throw new NotFoundError('Dishes not found' + error);
		}
	}

	public static async getById(id: number) {
		if (!id) throw new ValueError('Please provide where options');
		try {
			const dish: Dish | null = await prisma.dish.findUnique({
				where: {
					id: id
				}
			});
			if (dish) return dish;
			throw new NotFoundError('Dish not found');
		} catch (error) {
			throw new NotFoundError('Dish not found' + error);
		}
	}

	public static async update(dish: Dish) {
		if (!dish || !dish.id) throw new ValueError('dish not valid!' + dish);
		try {
			await prisma.dish.update({
				where: {
					id: dish.id
				},
				data: dish
			});
		} catch (error) {
			throw new ObjectUpdateError('Failed to update dish');
		}
	}
}

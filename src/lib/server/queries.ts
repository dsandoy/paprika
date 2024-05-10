import { NotFoundError, ValueError } from '$lib/errors';
import prisma from '$lib/prisma';
import type { ClientDish } from '$lib/types';
import type { User } from '@auth/sveltekit';
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
	public static async create(dish: ClientDish) {
		if (!dish) throw new ValueError('A dish  must be provided');
		if (!dish.user) throw new ValueError('No user provided in the dish');
		try {
			const result = await prisma.dish.create({
				data: {
					name: dish.name,
					url: dish.url,
					user: dish.user,
					image: dish.image,
					ingredients: { create: DishQueries.mapIngredients(dish.ingredients) }
				}
			});
			if (!result) throw new ObjectCreationError('Failed to create dish');
		} catch (error) {
			throw new ObjectCreationError('Failed to create dish' + error);
		}
	}

	public static async getMany(user: User, options: DQOptions = {}): Promise<Dish[]> {
		try {
			if (!options) {
				if (!user.email) throw new ValueError('No user email provided');
				const dishes = await prisma.dish.findMany({
					where: {
						user: user.email
					},
					include: {
						ingredients: true
					}
				});
				if (dishes) return dishes;
				throw new NotFoundError('Dishes not found');
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

	public static mapIngredients(ingredients: string[] | undefined) {
		if (ingredients === undefined) return [];
		const mappedIngredients: { value: string }[] = [];
		for (const ing of ingredients) {
			mappedIngredients.push({
				value: ing
			});
		}
		return mappedIngredients;
	}
}

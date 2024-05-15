import { NotFoundError, ValueError } from '$lib/errors';
import prisma from '$lib/prisma';
import type { ClientDish } from '$lib/types';
import type { Dish, Prisma } from '@prisma/client';
import type { Image } from '@prisma/client';

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

export class DishQueries {
	public static async create(dish: ClientDish, image: Image | null = null) {
		if (!dish) throw new ValueError('A dish  must be provided');
		if (!dish.user) throw new ValueError('No user provided in the dish');
		try {
			const result = await prisma.dish.create({
				data: {
					name: dish.name,
					url: dish.url,
					user: dish.user,
					ingredients: { create: DishQueries.mapIngredients(dish.ingredients) },
					image: image ? { create: image } : undefined
				}
			});
			if (!result) throw new ObjectCreationError('Failed to create dish');
		} catch (error) {
			throw new ObjectCreationError('Failed to create dish' + error);
		}
	}

	public static async getMany(email: string) {
		try {
			if (!email) throw new ValueError('No user email provided');
			const dishes = await prisma.dish.findMany({
				where: {
					user: email
				},
				include: {
					ingredients: true
				}
			});
			if (dishes) return dishes;
			throw new NotFoundError('Dishes not found');
		} catch (error) {
			throw new NotFoundError('Dishes not found' + error);
		}
	}

	public static async getById(id: number, email: string | null | undefined) {
		if (!id) throw new ValueError('Please provide an id options');
		if (!email) throw new ValueError('Please provide a valid email');
		try {
			const dish = await prisma.dish.findUnique({
				where: {
					id: id,
					user: email
				},
				include: {
					ingredients: true
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
		let data: Prisma.DishCreateInput;
		try {
			data = {
				name: dish.name,
				url: dish.url,
				ingredients: {
					updateMany: {
						where: {
							dishId: dish.id
						},
						data: dish.ingredients
					}
				}
			};

			if (dish.image)
				if (dish.image.size >= 0) {
					await prisma.image.deleteMany({
						where: {
							dishId: dish.id
						}
					});
					data = {
						...data,
						image: { create: dish.image }
					};
				}

			await prisma.dish.update({
				where: {
					id: dish.id
				},
				data: data
			});
		} catch (error) {
			throw new ObjectUpdateError('Failed to update dish' + error);
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

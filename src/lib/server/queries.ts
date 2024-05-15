import { NotFoundError, ValueError } from '$lib/errors';
import prisma from '$lib/prisma';
import type { CreateDish, UpdateDish } from '$lib/types';
import type { Dish, Prisma } from '@prisma/client';

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
	/** Converts a CreateDish to a Prisma.DishCreateInput */
	private static processCreateDish(dish: CreateDish) {
		const data: Prisma.DishCreateInput = {
			name: dish.name,
			url: dish.url,
			user: dish.user
		};
		if (dish.ingredients) data.ingredients = { create: dish.ingredients };
		if (dish.image) data.image = { create: dish.image };
		return data;
	}

	/**
	 *
	 * @param dish Dish to be created
	 * @returns dish if successful
	 * ```ts
	 * try {
	 * 	 const result = await DishQueries.create(dish);
	 * } catch(e) {
	 * 	 console.error(e);
	 * }
	 * ```
	 */
	public static async create(dish: CreateDish) {
		if (!dish) throw new ValueError('No dish provided');
		if (!dish.name) throw new ValueError('No name provided');
		if (!dish.user) throw new ValueError('No user provided');
		const data = this.processCreateDish(dish);

		try {
			const result = await prisma.dish.create({
				data: data
			});
			return result as Dish;
		} catch (error) {
			throw new ObjectCreationError('Failed to create dish' + error);
		}
	}

	/**
	 *
	 * @param email user email of current user
	 * @return array of dishes
	 */
	public static async getMany(email: string) {
		// TODO: using email is bad for security I think
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
			return dishes;
		} catch (error) {
			throw new NotFoundError('Failed to find dishes, reason: ' + error);
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

	private static processUpdateDish(dish: UpdateDish) {
		const data: Prisma.DishUpdateInput = {
			name: dish.name,
			url: dish.url
		};
		if (dish.ingredients) {
			data.ingredients = { create: dish.ingredients };
		}
		if (dish.image && dish.image.size > 0) data.image = { create: dish.image };
		return data;
	}

	public static async update(dish: UpdateDish) {
		if (!dish || !dish.id)
			throw new ValueError('dish not valid, missing ID or not provided! Dish: ' + dish);
		try {
			const data = this.processUpdateDish(dish);
			if (data.ingredients) {
				try {
					await prisma.ingredient.deleteMany({
						where: {
							dishId: dish.id
						}
					});
				} catch (e) {
					console.log('No entry to delete..');
				}
			}
			if (data.image) {
				try {
					await prisma.image.delete({
						where: {
							dishId: dish.id
						}
					});
				} catch (e) {
					console.log('No entry to delete..');
				}
			}
			await prisma.dish.update({
				where: {
					id: dish.id
				},
				data: data
			});
		} catch (error) {
			throw new ObjectUpdateError('Failed to update dish! Reason: ' + error);
		}
	}

	public static async delete(id: number) {
		if (!id) throw new ValueError('Please provide an id ');

		try {
			IngredientQueries.delete(id);
			ImageQueries.delete(id);
			await prisma.dish.delete({
				where: {
					id: id
				}
			});
		} catch (error) {
			throw new ObjectUpdateError('Failed to delete dish! Reason: ' + error);
		}
	}
}

export class IngredientQueries {
	public static async delete(dishId: number) {
		if (!dishId) throw new ValueError('Please provide an id ');
		await prisma.ingredient.deleteMany({
			where: {
				dishId: dishId
			}
		});
	}
}

export class ImageQueries {
	public static async delete(dishId: number) {
		if (!dishId) throw new ValueError('Please provide an id ');
		try {
			await prisma.image.delete({
				where: {
					dishId: dishId
				}
			});
		} catch {
			return;
		}
	}
}


const router = require('express').Router();

const mongoose = require('mongoose');
const Character = require('../models/Character.model');

router.get('/', async (req, res, next) => {
	try {
		const allCharacters = await Character.find();
		res.json(allCharacters);
	} catch (error) {
		next(error);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const { name, occupation, weapon, cartoon } = req.body;

		const wrongFields = {};

		for ([key, value] of Object.entries({ name, occupation, weapon })) {
			if (typeof value !== "string") wrongFields[key] = value;
		}

		if (Object.keys(wrongFields).length) {
			return res.status(400).json({ wrongFields });
		}

		const createdCharacter = await Character.create({
			name,
			occupation,
			weapon,
			cartoon: Boolean(cartoon),
		});
		res.status(201).json(createdCharacter);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;

		let oneCharacter = null;

		if (mongoose.isValidObjectId(id)) {
			oneCharacter = await Character.findById(id);
		}

		if (oneCharacter) {
			res.json(oneCharacter);
		} else {
			res.status(404).json({ message: `No such character with id: ${id}` });
		}
	} catch (error) {
		next(error);
	}
});

router.patch('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;

		let updatedCharacter = null;

		if (mongoose.isValidObjectId(id)) {
			const { name, occupation, cartoon, weapon } = req.body;

			const newValues = {};

			for ([key, value] of Object.entries({ name, occupation, weapon })) {
				if (value && typeof value === "string") newValues[key] = value;
			}

			newValues.cartoon = Boolean(cartoon);

			updatedCharacter = await Character.findByIdAndUpdate(
				id,
				newValues,
				{ new: true }
			);
		}

		if (updatedCharacter) {
			res.json(updatedCharacter);
		} else {
			res.status(404).json({ message: `No such character with id: ${id}` });
		}
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;

		if (mongoose.isValidObjectId(id)) {
			await Character.findByIdAndDelete(id);
		}

		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});

module.exports = router;

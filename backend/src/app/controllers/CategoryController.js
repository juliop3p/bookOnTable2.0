import * as Yup from 'yup';

import Category from '../models/Category';
import Post from '../models/Post';

class CategoryController {
  async index(req, res) {
    const { page = 1, all = false } = req.query;

    const totCategories = await Category.countDocuments();

    const limit = all ? 0 : 2;

    const categories = await Category.find({}, '_id title description imageURL')
      .limit(limit)
      .skip((page - 1) * limit);

    return res.json({ page, totCategories, categories });
  }

  async show(req, res) {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json(category);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      imageURL: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { _id: id, title, description, imageURL } = await Category.create(
      req.body
    );

    return res.json({
      id,
      title,
      description,
      imageURL,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      imageURL: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    try {
      await Category.findByIdAndUpdate(id, req.body);

      const { title, description, imageURL } = await Category.findById(id);

      return res.json({
        id,
        title,
        description,
        imageURL,
      });
    } catch (err) {
      return res.status(400).json({ error: 'Category not found.' });
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const hasAssociation = await Post.find().where('category').equals(id);

      if (hasAssociation.length > 0) {
        return res
          .status(403)
          .json({ error: 'Cannot remove associated category.' });
      }

      const category = await Category.findById(id);

      if (!category) {
        throw new Error();
      }

      category.deleteOne();
    } catch (err) {
      return res.status(400).json({ error: 'Category not found.' });
    }

    return res.json();
  }
}

export default new CategoryController();

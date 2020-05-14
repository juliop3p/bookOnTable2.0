import * as Yup from 'yup';

import Category from '../models/Category';
import Post from '../models/Post';

class CategoryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const categories = await Category.find({}, '_id title description imageURL')
      .limit(12)
      .skip((page - 1) * 12);

    return res.json(categories);
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

      await Category.deleteOne({ _id: id });
    } catch (err) {
      return res.status(400).json({ error: 'Category not found.' });
    }

    return res.json();
  }
}

export default new CategoryController();

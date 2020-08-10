import * as Yup from 'yup';

import Post from '../models/Post';
import Admin from '../models/Admin';

class PostController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const totPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('category', 'title description imageURL')
      .limit(2)
      .skip((page - 1) * 2)
      .populate()
      .sort({ createdAt: 'desc' });

    return res.json({ page, totPosts, posts });
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const post = await Post.findById(id).populate(
        'category',
        'title description imageURL'
      );

      return res.json(post);
    } catch (err) {
      return res.status(404).json({ error: 'Post not found' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      type: Yup.string().required(),
      imageURL: Yup.string().required(),
      videoURL: Yup.string().required(),
      textPortuguese: Yup.string().required(),
      textEnglish: Yup.string().required(),
      summary: Yup.string().required(),
      category: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    req.body.author = String(req.userId);

    const post = await Post.create(req.body);

    return res.json(post);
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      type: Yup.string(),
      imageURL: Yup.string(),
      videoURL: Yup.string(),
      textPortuguese: Yup.string(),
      textEnglish: Yup.string(),
      summary: Yup.string(),
      category: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    try {
      const { superAdmin, _id: idAuthor } = await Admin.findById(req.userId);
      const post = await Post.findById(id);

      if (!superAdmin || !idAuthor === post.author) {
        return res.status(401).json({ error: 'Not allowed.' });
      }

      await post.updateOne(req.body);

      const postUpdated = await Post.findById(id);

      return res.json(postUpdated);
    } catch (err) {
      return res.json(err);
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    const isSuperAdmin = await Admin.findById(req.userId)
      .where('superAdmin')
      .equals(true);

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (String(post.author) !== req.userId || !isSuperAdmin) {
      return res.status(401).json({ error: 'Not allowed.' });
    }

    post.deleteOne();

    return res.json();
  }
}

export default new PostController();

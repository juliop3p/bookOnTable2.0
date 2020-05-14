import * as Yup from 'yup';

import Post from '../models/Post';
import Admin from '../models/Admin';

class PostController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('category', 'title description imageURL')
      .limit(12)
      .skip((page - 1) * 12);

    return res.json(posts);
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

      // TO DO
      /*
      think what's the best approach get data again
      or get one data updated and put on the hook
      */
      const postUpdated = await Post.findById(id);

      return res.json(postUpdated);
    } catch (err) {
      return res.json(err);
    }
  }
}

export default new PostController();

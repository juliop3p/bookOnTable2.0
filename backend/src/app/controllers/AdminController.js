import * as Yup from 'yup';

import Admin from '../models/Admin';

class AdminController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const admins = await Admin.find({}, '_id name email superAdmin')
      .limit(10)
      .skip((page - 1) * 10);

    return res.json(admins);
  }

  async store(req, res) {
    const adminExists = await Admin.findOne({ email: req.body.email });

    if (adminExists) {
      return res.status(400).json({ error: 'Admin already exists.' });
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
      superAdmin: Yup.bool(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { _id, name, email } = await Admin.create(req.body);

    return res.json({
      id: _id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      password: Yup.string(),
      superAdmin: Yup.bool(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    try {
      await Admin.findByIdAndUpdate(req.userId, req.body);

      const { superAdmin, _id, name, email } = await Admin.findById(req.userId);

      return res.json({
        superAdmin,
        id: _id,
        name,
        email,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  async destroy(req, res) {
    try {
      await Admin.findByIdAndDelete(req.userId);

      return res.json();
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

export default new AdminController();

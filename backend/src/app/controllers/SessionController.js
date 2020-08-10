import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import Admin from '../models/Admin';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { email, password } = req.body;

    try {
      const { id, name } = await Admin.findByCredentials(email, password);

      return res.json({
        id,
        name,
        email,
        token: jwt.sign({ id }, process.env.SECRET, {
          expiresIn: '7d',
        }),
      });
    } catch (err) {
      return res.status(401).json({ error: err.message });
    }
  }
}

export default new SessionController();

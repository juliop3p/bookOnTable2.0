import Admin from '../models/Admin';

/*
dar super permissões para outros admins (done)
super admins pode deletar outros admins (mas não outros super admins) (done)
super admins pode excluir qualquer post
*/

class SuperAdminController {
  async update(req, res) {
    const { id } = req.params;

    const isSuperAdmin = await Admin.findById(req.userId)
      .where('superAdmin')
      .equals(true);

    if (!isSuperAdmin) {
      return res.status(401).json({ error: 'Not allowed.' });
    }

    try {
      await Admin.findByIdAndUpdate(id, {
        superAdmin: true,
      });

      const { name, email, superAdmin } = await Admin.findById(id);

      return res.json({
        id,
        name,
        email,
        superAdmin,
      });
    } catch (err) {
      return res.status(400).json({ error: 'Could not delete.' });
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    const isSuperAdmin = await Admin.findById(req.userId)
      .where('superAdmin')
      .equals(true);

    if (!isSuperAdmin) {
      return res.status(401).json({ error: 'Not allowed.' });
    }

    try {
      await Admin.findByIdAndDelete(id);
    } catch (err) {
      return res.status(400).json({ error: 'Could not delete.' });
    }

    return res.json();
  }
}

export default new SuperAdminController();

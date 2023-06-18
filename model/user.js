const db = require('../data/connect')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const saltRounds = 10;

const getAll = async () => {
    const result = await db.database.all('SELECT * FROM user')
    return result
}


const getUser = async (id) => {
  const result = await db.database.get('SELECT id, email, role FROM user WHERE id=?', id)
  return result
}

const connexion = async (email, password) => {
    const result = await db.database.get('SELECT * FROM user WHERE email=?', email)
    if (result) {

        if (await bcrypt.compare(password, result.password)) {
            delete result.password
            const token = jwt.sign(result, 'maSuperCle');
            return { mess: "utilisateur connecté", token }
        }
        else {
            return { error: "mot de passe ou identifiant inconnus" }
        }
    } else {
        return { error: "mot de passe ou identifiant inconnus" }
    }

}

const inscription = async (email, password) => {
    const hash = await bcrypt.hash(password, saltRounds);
  
    let result;
    await db.database.run('BEGIN TRANSACTION;');
  
    try {
      result = await db.database.run(
        `INSERT INTO user (email, password) VALUES (?, ?);`,
        email,
        hash
      );
      const user_id = result.lastID;
  
      await db.database.run(`INSERT INTO cart (user_id) VALUES (?);`, user_id);
  
      await db.database.run('COMMIT;');
    } catch (error) {
      await db.database.run('ROLLBACK;');
      return { error: "Erreur lors de l'ajout" };
    }
  
    return result;
  };

  const del = async (id) => {
      const result = await db.database.run(
          'DELETE FROM user WHERE id=?',
          id
      )
      if (result.changes > 0) return result
      else return { error: "erreur lors de la suppression" }
  }

  const changePassword = async (id , password) => {
    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.database.run(
        `UPDATE user
        SET password=?
        WHERE id=? ;`,
        hash, id
    )
    if (result.changes > 0) return result
    else return { error: "erreur lors de la suppression" }
}

module.exports = {
    changePassword,
    del,
    getUser,
    connexion,
    inscription,
    getAll,
}
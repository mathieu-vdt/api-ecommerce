const db = require('../data/connect')

const getAll = async () => {
    const result = await db.database.all('SELECT * FROM produit')
    return result
}
const getById = async (id) => {
    const result = await db.database.get('SELECT * FROM produit WHERE id=?', id)
    return result
}

const getAllByUserId = async (user_id) => {
    const result = await db.database.all(`
      SELECT p.*, ci.quantity
      FROM produit p
      LEFT JOIN cart_item ci ON p.id = ci.product_id
      LEFT JOIN cart c ON ci.cart_id = c.id AND c.user_id = ?
    `, user_id);
  
    return result;
  };

const add = async (nom, description, prix, photo) => {
    try {
        const result = await db.database.run(
            'INSERT INTO produit (nom,prix,description,photo) VALUES (?,?,?,?)',
            nom, prix, description, photo
        )
        // console.log(result);
        if (result.lastID) return result
        else return { error: "erreur lors de l'ajout" }
    }
    catch (err) {
        console.error(err)
    }
}
const modif = async (id, nom, description, prix, photo) => {
    const result = await db.database.run(
        'UPDATE produit SET nom=?,prix=?,description=?,photo=? WHERE id=?',
        nom, prix, description, photo, id
    )
    if (result.changes > 0) return result
    else return { error: "erreur lors de la modification" }
}
const del = async (id) => {
    const result = await db.database.run(
        'DELETE FROM produit WHERE id=?',
        id
    )
    if (result.changes > 0) return result
    else return { error: "erreur lors de la suppression" }
}

module.exports = {
    getAllByUserId,
    getAll,
    getById,
    add,
    modif,
    del
}
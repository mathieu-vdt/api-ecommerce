const db = require('../data/connect')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const saltRounds = 10;

const getAll = async () => {
    const result = await db.database.all(`
    SELECT * From cart_item`)
    return result
}


const getCartByUser = async (user_id) => {
    const result = await db.database.all(`
      SELECT ci.cart_id, p.id as product_id, ci.id, p.nom, p.prix, ci.quantity
      FROM cart_item as ci
      JOIN produit p ON ci.product_id = p.id
      JOIN cart c ON ci.cart_id = c.id
      WHERE c.user_id = ?`, user_id);
          
    return result;
  }

const getCartIdByUser = async (user_id) => {
    const result = await db.database.get(`
        SELECT id FROM cart WHERE user_id=?`, user_id);
            
    return result;
}

const addCart = async (user_id) => {
    try {

        const result = await db.database.run(
            'INSERT INTO cart (user_id) VALUES (?)',
            user_id
        )
        // console.log(result);
        if (result.lastID) return result
        else return { error: "erreur lors de l'ajout" }
    }
    catch (err) {
        console.error(err)
    }
}

const addCartItem = async (cart_id, product_id, quantity) => {
    try {
        const existingItem = await db.database.get(
            `SELECT * FROM cart_item WHERE cart_id = ? AND product_id = ?`,
            cart_id, product_id
        );

        if (existingItem) {
            const updatedQuantity = existingItem.quantity + quantity;
            await db.database.run(
                `UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND product_id = ?`,
                updatedQuantity, cart_id, product_id
            );
        } else {
            await db.database.run(
                `INSERT INTO cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
                cart_id, product_id, quantity
            );
        }

        return { success: true };
    } catch (err) {
        console.error(err);
        return { error: "erreur lors de l'ajout" };
    }
};

const removeCartItem = async (cart_id, product_id) => {
    try {
      await db.database.run(
        `DELETE FROM cart_item WHERE cart_id = ? AND product_id = ?`,
        cart_id,
        product_id
      );
  
      return { success: true };
    } catch (err) {
      console.error(err);
      return { error: "Erreur lors de la suppression de l'élément du panier" };
    }
};


// Modification du nombre d'un produit dans le panier
const modifQuantity = async (quantity, cart_id) => {
    const result = await db.database.run(
        'UPDATE cart_item SET quantity=? WHERE cart_id=?',quantity, cart_id
    )
    if (result.changes > 0) return result
    else return { error: "erreur lors de la modification" }
}

module.exports = {
    removeCartItem,
    getCartIdByUser,
    modifQuantity,
    addCart, 
    addCartItem,
    getCartByUser,
    getAll,
}
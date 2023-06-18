const db = require('../data/connect')


const getAll = async () => {
  const results = await db.database.all(
    `
    SELECT o.id AS commande_id,o.status, o.date, op.id as orderProduct_id, p.id AS produit_id, p.nom, p.prix, op.quantity
    FROM 'order' AS o
    JOIN order_product AS op ON o.id = op.order_id
    JOIN produit AS p ON op.product_id = p.id
    ORDER BY o.id
  `
  );

  const groupedOrders = Array.from(
    results.reduce((map, order) => {
      const { commande_id, date,status, orderProduct_id, nom, prix, quantity } = order;
      const orderGroup = map.get(commande_id);

      if (orderGroup) {
        orderGroup.produits.push({ id: orderProduct_id, nom, prix, quantity });
      } else {
        map.set(commande_id, {
          commande_id,
          status,
          date,
          produits: [{ id: orderProduct_id, nom, prix, quantity }],
        });
      }
      return map;
    }, new Map()).values()
  );

  return groupedOrders;
};

const getOrder = async (id) => {

    const result = await db.database.get(`
        SELECT o.id AS commande_id, o.date, p.id AS produit_id, p.nom, p.prix, op.quantity
        FROM 'order' as o
        JOIN order_product op ON o.id = op.order_id
        JOIN produit p ON op.product_id = p.id
        WHERE op.order_id=?`, id)
        

    return result
}

const getOrderByUser = async (id) => {
    const results = await db.database.all(
      `
      SELECT o.id AS commande_id,o.status, o.date, op.id as orderProduct_id, p.id AS produit_id, p.nom, p.prix, op.quantity
      FROM 'order' AS o
      JOIN order_product AS op ON o.id = op.order_id
      JOIN produit AS p ON op.product_id = p.id
      WHERE o.user_id=?
      ORDER BY o.id
    `,
      id
    );
  
    const groupedOrders = Array.from(
      results.reduce((map, order) => {
        const { commande_id, date,status, orderProduct_id, nom, prix, quantity } = order;
        const orderGroup = map.get(commande_id);
  
        if (orderGroup) {
          orderGroup.produits.push({ id: orderProduct_id, nom, prix, quantity });
        } else {
          map.set(commande_id, {
            commande_id,
            status,
            date,
            produits: [{ id: orderProduct_id, nom, prix, quantity }],
          });
        }
        return map;
      }, new Map()).values()
    );
  
    return groupedOrders;
  };
  
  


const getById = async (id) => {
    const result = await db.database.get(`
        SELECT o.id AS commande_id, o.date, o.user_id, p.id AS produit_id, p.nom, p.prix, op.quantity
        FROM 'order' o
        JOIN order_product op ON o.id = op.commande_id
        JOIN produit p ON op.product_id = p.id
        
        WHERE o.id=?`, id
    )
    return result
}

const addOrder = async (user_id) => {
    try {

        const result = await db.database.run(
            'INSERT INTO "order" (user_id) VALUES (?)',
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

const addProductInOrder = async (order_id, product_id, quantity) => {
    try {

        const result = await db.database.run(
            'INSERT INTO order_product (order_id ,product_id ,quantity) VALUES (?,?,?)',
            order_id, product_id, quantity
        )
        // console.log(result);
        if (result.lastID) return result
        else return { error: "erreur lors de l'ajout" }
    }
    catch (err) {
        console.error(err)
    }
}

async function createOrder(user_id, products) {
    try {
      // Démarre une transaction
      await db.database.run('BEGIN TRANSACTION');
  
      // Étape 1 : Insérer la commande
      const insertOrderQuery = `
        INSERT INTO \`order\` (user_id) VALUES (?);
        SELECT last_insert_rowid() AS order_id;
      `;
      const orderResult = await db.database.run(insertOrderQuery, [user_id]);
  
      // Récupérer l'ID de la commande créée
      const orderId = orderResult.lastID;
  
      // Étape 2 : Insérer les produits de la commande
      const insertOrderItemsQuery = `
        INSERT INTO order_product (order_id, product_id, quantity)
        VALUES ${products
          .map((product) => `(${orderId}, ${product.id}, ${product.quantity})`)
          .join(', ')};
      `;
      await db.database.run(insertOrderItemsQuery);
  
      // Étape 3 : Sélectionner les détails de la commande créée
      const selectOrderDetailsQuery = `
        SELECT op.order_id, o.user_id, o.date, op.product_id, op.quantity
        FROM \`order\` o
        JOIN order_product op ON o.id = op.order_id
        WHERE o.id = ?;
      `;
      const orderDetailsResult = await db.database.all(selectOrderDetailsQuery, [orderId]);
  
      // Étape 4 : Supprimer les cart_item correspondants
      const deleteCartItemsQuery = `
        DELETE FROM cart_item
        WHERE cart_id IN (
            SELECT id
            FROM cart
            WHERE user_id = ?
        ) AND product_id IN (${products.map((product) => product.id).join(', ')});
        `;
        await db.database.run(deleteCartItemsQuery, [user_id]);

  
      // Valide la transaction
      await db.database.run('COMMIT');
  
      // Retourner les détails de la commande
      return orderDetailsResult;
    } catch (error) {
      // Annule la transaction en cas d'erreur
      await db.database.run('ROLLBACK');
  
      console.error('Erreur lors de la création de la commande', error);
      throw error;
    }
  }
  
  
  
// Modification d'un produit de la commande et non la commande
const modif = async (id, order_id, produit_id, quantity) => {
    const result = await db.database.run(
        'UPDATE order_product SET order_id=?,product_id=?,quantity=? WHERE id=?',
        order_id, produit_id, quantity, id
    )
    if (result.changes > 0) return result
    else return { error: "erreur lors de la modification" }
}

const changeStatus = async (order_id, status) => {
  const result = await db.database.run(
      'UPDATE "order" SET status=? WHERE id=?',
      status, order_id
  )
  if (result.changes > 0) return result
  else return { error: "erreur lors de la modification" }
}

// Supprimer la commande ainsi que les produits de la commande
const del = async (id) => {
    const result = await db.database.run(
        'DELETE FROM "order" WHERE id=?',
        id
    )

    const result2 = await db.database.run(
        'DELETE FROM order_product WHERE order_id=?',
        id
    )
    if (result.changes > 0 && result2.changes > 0) return result
    else return { error: "erreur lors de la suppression" }
}

module.exports = {
    changeStatus,
    getAll,
    getOrder,
    getOrderByUser,
    getById,
    addOrder,
    createOrder,
    addProductInOrder,
    modif,
    del
}
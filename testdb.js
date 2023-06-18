const db = require('./data/connect')
// const { add, getAll, getById, modif, del } = require('./model/product')
const { inscription, connexion } = require('./model/user')

db.connect()

setTimeout(async () => {
    // console.log(await getAll());
    // console.log(await getById(3));
    // console.log(await add("test", "description de test", 12.4, ""));
    // console.log(await modif(2, 'test modif', 'description modifié', 10, ""));
    // console.log(await del(2));
    // console.log(await inscription('julien@jdedev.fr', 'test'));
    // console.log(await connexion('julien2@jdedev.fr', 'test2'));
}, 2000)
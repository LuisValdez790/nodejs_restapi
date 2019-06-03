//caraga nuestro app server

const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require("mysql");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

//abrir html
app.use(express.static('./public'));


app.post('/product_create', (req, res) => {
    console.log("Intentando crear un producto...");
    console.log("Como obtengo mis datos del html...");

    console.log("Nombre de producto: " + req.body.create_namep);
    console.log("Descripcion de producto: " + req.body.create_descriptionp);
    console.log("Precio de producto: " + req.body.create_pricep);
    const namep = req.body.create_namep;
    const descriptionp = req.body.create_descriptionp;
    const pricep = req.body.create_pricep;
    const queryString = "INSERT INTO product (namep,descriptionp,pricep) VALUES (?, ?, ?)";
    getConnection().query(queryString, [namep, descriptionp, pricep], (err, results, fields) => {
        if (err) {
            console.log("Fallo" + err);
            res.sendStatus(500);
            return;
        }

        console.log("Inserted a new Product with id: ", results.insertedId);
        res.end();

    });
});

//Funcion de conexion
function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'products'
    });
}


app.get('/product/:id', (req, res) => {
    console.log("Fetching product with id" + req.params.id);

    const connection = getConnection();

    const productId = req.params.id;
    const queryString = "SELECT * FROM product WHERE id = ?";
    connection.query(queryString, [productId], (err, rows, fields) => {
        if (err) {
            console.log("Fallo" + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        console.log("Creo que todo va bien");
        const products = rows.map((row) => {
            return { namep: row.namep, pricep: row.pricep };
        });
        res.json(products);
    })

    //res.end();
})

//Checar informacion de llamadas
app.use(morgan('short'));

//Principal
app.get("/", (req, res) => {
    console.log("Respondiendo desde root")
    res.send("IM ROOTT");
});

//Api
app.get("/products", (req, res) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'products'
    })
    const queryString = "SELECT * FROM product";
    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Fallo" + err);
            res.sendStatus(500);
            res.end();
            return;
        }

        res.json(rows);
    })

});

//localhost:3004
app.listen(3004, () => {
    console.log("Servidor en 3004...");
});
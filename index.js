const app = require("./app");

async function main() {
    const port = 3000;
    await app.listen(port);
    console.log("Servidor funcionando en el puerto "+port);
}

main();
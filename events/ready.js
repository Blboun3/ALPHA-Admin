module.exports = {
    name: 'ready', // Funkce která proběhne, když se bot zapne
    once: true, // Proběhne pouze jednou
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`); // Napíše do console že je online a svůj user.
    },
};
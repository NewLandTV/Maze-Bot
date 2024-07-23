// Require
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { token } = require("./config.json");
const fs = require("fs");

// Game board variables (0 : empty, 1 : wall, 2 : finish)
const gameBoard = [ 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 1, 0, 0, 0, 1,
                    1, 0, 0, 1, 0, 1, 1,
                    1, 1, 0, 0, 0, 0, 1,
                    1, 0, 0, 1, 0, 1, 1,
                    1, 0, 1, 1, 0, 2, 1,
                    1, 1, 1, 1, 1, 1, 1 ];
const gameBoardWidth = 7;
const gameBoardHeight = 7;

let playerPositionX = 1;
let playerPositionY = 1;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);
}

// The maze game functions.
function GetGameBoard(x, y) {
    return gameBoard[x + y * gameBoardWidth];
}

async function DrawGameBoard(interaction) {
    map = "";
    x = 0;
    y = 0;

    gameBoard.forEach(pixel => {
        if (x == playerPositionX && y == playerPositionY) {
            map += "@";
        } else {
            if (x >= gameBoardWidth) {
                x = 0;
                y++;

                map += "\n";
            }
            
            if (pixel === 0) {
                map += "--";
            } else if (pixel === 1) {
                map += "#";
            } else if (pixel === 2) {
                map += "F";
            }
        }

        x++;
    });

    // Game board
    const gameEmbed = new EmbedBuilder()
        .setColor(0x20880f)
        .setTitle("Maze Game")
        .setDescription(map);

    // Controls (Move buttons)
    const rowButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel("← Left")
                .setStyle("Secondary")
                .setCustomId("leftMove"),
            new ButtonBuilder()
                .setLabel("↓ Down")
                .setStyle("Secondary")
                .setCustomId("downMove"),
            new ButtonBuilder()
                .setLabel("↑ Up")
                .setStyle("Secondary")
                .setCustomId("upMove"),
            new ButtonBuilder()
                .setLabel("→ Right")
                .setStyle("Secondary")
                .setCustomId("rightMove")
    );

    await interaction.reply({ embeds: [gameEmbed], components: [rowButtons] });
}

client.once("ready", () => {
    client.user.setActivity("미로", { type: "PLAYING" });

    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
    // Button
    if (interaction.isButton()) {
        if (interaction.customId === "leftMove") {
            playerPositionX--;

            if (GetGameBoard(playerPositionX, playerPositionY) === 1) {
                playerPositionX++;
            }
        } else if (interaction.customId === "downMove") {
            playerPositionY++;

            if (GetGameBoard(playerPositionX, playerPositionY) === 1) {
                playerPositionY--;
            }
        } else if (interaction.customId === "upMove") {
            playerPositionY--;

            if (GetGameBoard(playerPositionX, playerPositionY) === 1) {
                playerPositionY++;
            }
        } else if (interaction.customId === "rightMove") {
            playerPositionX++;

            if (GetGameBoard(playerPositionX, playerPositionY) === 1) {
                playerPositionX--;
            }
        }

        if (GetGameBoard(playerPositionX, playerPositionY) == 2) {
            await interaction.reply(`<@${interaction.user.id}> Finish! (끝!)`);

            return;
        }

        DrawGameBoard(interaction);

        return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        // Slash command execute
        await command.execute(interaction);

        DrawGameBoard(interaction);
    } catch (error) {
        console.error(error);

        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

client.login(token);
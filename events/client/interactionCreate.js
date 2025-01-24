const { Events, MessageFlags } = require("discord.js");
const { isCommandInCategory } = require("@utils/commandUtils");

module.exports = {
  name: Events.InteractionCreate,
  async execute(distube, interaction) {
    if (interaction.isButton()) {
      const buttonCommand = interaction.client.commands.get(
        interaction.customId
      );

      if (buttonCommand) {
        try {
          await buttonCommand.execute(distube, interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "There was an error while executing this button action!",
            flags: MessageFlags.Ephemeral,
          });
        }
      } else {
        console.error(`No command matching ${interaction.customId} was found.`);
      }

      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    if (interaction.isChatInputCommand()) {
      try {
        // Check if the command is music related
        if (isCommandInCategory(command, "music")) {
          await command.execute(distube, interaction);
        } else await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      return;
    }

    if (interaction.isAutocomplete()) {
      try {
        if (isCommandInCategory(command, "music")) {
          await command.autocomplete(interaction);
        } else await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
        await interaction.respond({
          type: 6,
          data: {
            content: "There was an error while executing this command!",
            flags: MessageFlags.Ephemeral,
          },
        });
      }

      return;
    }
  },
};

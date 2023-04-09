import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder,
  ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Sends application to admin team for some special request.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("vip").setDescription("Application for VIP role")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("mod").setDescription("Application for MOD role")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("different")
        .setDescription("Application for other role (possibly custom)")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("helper")
        .setDescription("Application for any of the helper roles.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    // Name
    const name = new TextInputBuilder()
      .setCustomId("applicant_name")
      .setLabel("Jméno")
      .setMaxLength(500)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);
    // Reasons
    const reasons = new TextInputBuilder()
      .setCustomId("applicant_reasons")
      .setLabel(`Proč bychom vám měli roli udělit?`)
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);
    // Name and description of special role
    const custRole = new TextInputBuilder()
      .setCustomId("applicant_cust_role")
      .setLabel("Popis vaší role")
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);
    // Focuses
    const focuses = new TextInputBuilder()
      .setCustomId("applicant_focuses")
      .setLabel("Vaše zájmy na tomto serveru ?")
      .setMaxLength(2000)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    // Custom role
    if (interaction.options.getSubcommand() === "different") {
      // In case of 'different' request
      const modal = new ModalBuilder()
        .setCustomId("application_request_dif")
        .setTitle("Žádost o roli");
      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(name);
      const secondActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasons);
      const thirdActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(custRole);
      const fourthActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(focuses);

      modal.addComponents(
        firstActionRow,
        secondActionRow,
        thirdActionRow,
        fourthActionRow
      );
      return await interaction.showModal(modal);

      // For VIP and MOD applications
    } else if (
      interaction.options.getSubcommand() === "vip" ||
      interaction.options.getSubcommand() === "mod"
    ) {
      // VIP
      if (interaction.options.getSubcommand() === "vip") {
        const modal = new ModalBuilder()
          .setCustomId("application_request_vip")
          .setTitle("Žádost o roli");
        const firstActionRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(name);
        const secondActionRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(reasons);
        const thirdActionRow =
          new ActionRowBuilder<TextInputBuilder>().addComponents(focuses);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
        return await interaction.showModal(modal);
      }
      // MOD
      const modal = new ModalBuilder()
        .setCustomId("application_request_mod")
        .setTitle("Žádost o roli");
      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(name);
      const secondActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasons);
      const thirdActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(focuses);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
      return await interaction.showModal(modal);
      // Helper
    } else if (interaction.options.getSubcommand() === "helper") {
      // Helper applications
      const modal = new ModalBuilder()
        .setCustomId("application_request_hlp")
        .setTitle("Žádost o roli");

      const roleSelector = new TextInputBuilder()
        .setCustomId("applicant_role_select")
        .setLabel("Pro jaký obor ?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(200)
        .setRequired(true);

      const firstActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(name);
      const insertedActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(roleSelector);
      const secondActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasons);
      const thirdActionRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(focuses);

      modal.addComponents(
        firstActionRow,
        insertedActionRow,
        secondActionRow,
        thirdActionRow
      );
      return await interaction.showModal(modal);
    }
  },
};

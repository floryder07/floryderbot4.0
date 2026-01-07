import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ChatInputCommandInteraction } from "discord.js";

/**
 * Simple /pickoftheday command stub.
 * In V1 replace the stubbed logic with signal engine calls.
 */

export const data = new SlashCommandBuilder()
  .setName("pickoftheday")
  .setDescription("Provide one prioritized statistical pick for today")
  .addStringOption((opt) =>
    opt
      .setName("mode")
      .setDescription("Mode: safe | normal | moonshot")
      .addChoices(
        { name: "safe", value: "safe" },
        { name: "normal", value: "normal" },
        { name: "moonshot", value: "moonshot" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;
  const mode = interaction.options.getString("mode") || "normal";

  // Stubbed pick — replace with real engine output
  const stubPick = {
    title: "LAL vs BOS — Team total (LAL) - Under",
    confidenceBadge: "🟠",
    computedTotal: 62.4,
    subScores: {
      trend_score: 68,
      matchup_score: 55,
      injury_score: 80,
      recency_boost: 10
    },
    explanation:
      "Medium confidence: LAL's defensive rating improved over last 5 games and BOS injured bench reduces pace. Not betting advice."
  };

  await (interaction as ChatInputCommandInteraction).reply({
    embeds: [
      {
        title: stubPick.title,
        fields: [
          { name: "Confidence", value: `${stubPick.confidenceBadge} (${Math.round(stubPick.computedTotal)}%)`, inline: true },
          { name: "Mode", value: mode, inline: true },
          {
            name: "Explanation",
            value: stubPick.explanation
          }
        ],
        footer: { text: "Not betting advice • FloryderBot 4.0" }
      }
    ]
  });
}

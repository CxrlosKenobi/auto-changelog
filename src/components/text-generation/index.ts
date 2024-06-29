import { readFileSync } from "fs";
import path from "path";
import OpenAI from "openai";

export async function getChangelogBlock({ apiKey, commits, __dirname }: { apiKey: string; commits: any[], __dirname: string }) {
  let header = null;
  try {
    const headerPath = path.join(__dirname, "header.md").replace("/dist", "/src/blocks");
    header = readFileSync(headerPath, "utf-8");

  } catch (error) {
    console.error("Error reading header file", error);
  }

  const openai = new OpenAI({ apiKey });
  console.log("Getting GPT-4 Turbo response...");
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You will be provided with a list of GitHub commits formatted according to the conventional commit standard. Each commit message includes a type, a scope, and a description. Classify each commit into categories: Added, Fixed, Changed, or Removed, based on the commit type. Format each commit into a markdown formatted list under the appropiate heading using emojis: ➕ (Added), 🛠️ (Fixed), 🔄 (Changed), or ❌ (Removed). Select an emoji that closely matches the action or context of the commit description and place it at the beginning of each commit entry. At the end of each description, include the commit SHA, shortened to the first 7 characters, in markdown link format wrapped with backquotes."
      },
      {
        role: "user",
        content: "Here are the commits:"
      },
      {
        role: "system",
        content: "Generate a changelog block with the commits provided."
      },
      {
        role: "user",
        content: JSON.stringify(commits)
      }
    ],
    model: "gpt-4-turbo"
  });

  console.log("GPT Output\n", completion);
  const releaseBlockBody = completion.choices[0].message.content;
  return releaseBlockBody;
}

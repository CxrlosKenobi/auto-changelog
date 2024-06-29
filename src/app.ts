import path from "path";
import { fileURLToPath } from "url";
import * as core from "@actions/core";
import * as http from "@actions/http-client";
//
import { getCommits } from "./components/octokit/index.js";
import { getChangelogBlock } from "./components/text-generation/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * NOTE: There's no separation of concerns yet, nor modularized code.
 * since I'm testing the whole workflow in one file before splitting it up.
 */

async function run(): Promise<void> {
  try {
    // These should be a token/key with scoped access to the repository, as a secret variable.
    const ghToken = core.getInput("github_repo_token", { required: true });
    const openAIKey = core.getInput("openai_api_key", { required: true });
    core.setSecret(ghToken);
    core.setSecret(openAIKey);

    const commits = await getCommits({ ghToken }); // Getting commits metadata using Octokit APIs
    //
    const changelog = await getChangelogBlock({ apiKey: openAIKey, commits, __dirname }); // Generating changelog content using LLM APIs
    core.info(`Changelog generation:\n${changelog}`);

    const version = determineVersion(commits); // Determining version based on semantic commits actions

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

async function determineVersion(commits: any) {
}

run();

import * as core from "@actions/core";
import * as github from "@actions/github";
import * as http from "@actions/http-client";

async function run(): Promise<void> {
  try {
    // This should be a token with access to the repository scoped in as a secret.
    const ghToken = core.getInput("github_repo_token", { required: true });
    const openaiKey = core.getInput("openai_api_key", { required: true });
    // core.setSecret(ghToken);

    // For local dev purposes log the token and key
    core.info(`GitHub Token: ${ghToken}`);
    core.info(`OpenAI Key: ${openaiKey}`);

    const octokit = github.getOctokit(ghToken);
    const context = github.context;
    //
    const commits = await getCommits(context); // Getting commits metadata
    const changelog = await generateChangelog(commits); // Generating changelog using LLM APIs
    const version = determineVersion(commits); // Determining version based on semantic commits actions

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

async function getCommits(context: any) {
}

async function generateChangelog(commits: any) {
}

async function determineVersion(commits: any) {
}

run();

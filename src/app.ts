import * as core from "@actions/core";
import * as github from "@actions/github";
import * as http from "@actions/http-client";

async function run(): Promise<void> {
  try {
    // This should be a token with access to the repository scoped in as a secret.
    const ghToken = core.getInput("github_repo_token", { required: true });
    const openaiKey = core.getInput("openai_api_key", { required: true });
    core.setSecret(ghToken);
    core.setSecret(openaiKey);

    const context = github.context;
    const commits = await getCommits({ ghToken, context }); // Getting commits metadata
    //
    const changelog = await generateChangelog(commits); // Generating changelog using LLM APIs
    const version = determineVersion(commits); // Determining version based on semantic commits actions

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

async function getCommits({ ghToken, context }: { ghToken: string; context: any }) {
  if (context.payload.pull_request) {
    const pr = context.payload.pull_request;
    core.info(`PR number: ${pr.number}`);

  } else {
    core.info("No pull request found.");
    return [];
  }

  const octokit = github.getOctokit(ghToken);
  const { data: commits } = await octokit.rest.pulls.listCommits({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.issue.number
  });

  core.info(`Commits: ${commits}`);
  core.info(`Commits count: ${commits.length}`);
}

async function generateChangelog(commits: any) {
}

async function determineVersion(commits: any) {
}

run();

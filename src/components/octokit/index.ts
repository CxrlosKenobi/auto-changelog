import * as core from "@actions/core";
import * as github from "@actions/github";

export async function getCommits({ ghToken }: { ghToken: string }) {
  const commitUrl = "https://github.com/CxrlosKenobi/auto-changelog/commit/"; // TODO: Make this dynamic and reactive with octokit API

  const context = github.context;

  if (context.payload.pull_request) {
    const pr = context.payload.pull_request;
    core.debug(`PR number: ${pr.number}`);

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

  core.debug(`Commits count: ${commits.length}`);

  // Clean up the commits data by extracting only the necessary information.
  // This also saves token usage with the LLM API.
  const cleanedCommits = commits.map((commit) => {
    return {
      sha: commit.sha,
      commit: {
        committer: commit.commit.committer,
        message: commit.commit.message,
        url: `${commitUrl}${commit.sha}`
      },
      parents: commit.parents
    };
  });

  return cleanedCommits;
}

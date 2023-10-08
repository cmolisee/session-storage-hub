# Contributing to Session Storage Hub

 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submitting-an-issue)
 - [Coding Rules](#coding-rules)
 - [Commit Message Guidelines](#commits)

## Question

Do not open an issue without first checking the [discussion](https://github.com/cmolisee/session-storage-hub/discussions) forums and starting a new post.

## Issue

If you find a bug in the source code, you can help us by starting a new post in the [discussion](https://github.com/cmolisee/session-storage-hub/discussions) forum and submitting a new issue.

Please link the discussion post in the body of the issue and provide sufficient information:
- how was the issue discovered
- how to replciate the issue

## Feature

You can *request* a new feature by starting a [discussion](https://github.com/cmolisee/session-storage-hub/discussions).

It should include all pertinent information on the proposal.

### Submitting An Issue

Under Construction

### Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/cmolisee/session-storage-hub/pulls) for an open or closed PR that relates to your submission.
   You don't want to duplicate existing efforts.

2. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
   Discussing the design upfront helps to ensure that we're ready to accept your work.

3. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the angular/angular repo.

4. In your forked repository, make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch main
     ```

5. Create your patch, **including appropriate test cases** (NOT CURRENTLY REQUIRED. NO TESTS IMPLEMENTED AS OF 10/08/23). You must ensure your code is linted, formatted, and builds. It is also necessary to ensure you thoroughly smoke and regression test in the browser.

6. Follow our [Coding Rules](#rules).

7. You should make small and descriptive commits throughout development. Release notes and versioning is handled automatically based on commits.

8. Push your branch to GitHub.

9. In GitHub, send a pull request to `main`.

### Reviewing a Pull Request

Your Pull Request must be reviewed and approved before it can be merged. There is no garuntee that your PR will be approved and/or merged. There may be additional requirements or requests before the PR is accepted, approved, and/or merged.

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes from the main (upstream) repository.
Your branch will automatically be deleted in the origin.

## Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* Test your changes.
* Document your code.
* Avoid hard to read code, nested blocks more than 4 levels, obscure code, inefficient code.

## Commits

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|docs-infra|migrations|
  │                          devtools
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.


##### Type

Must be one of the following (we use the same conventions as angular):

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (examples: CircleCi, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **test**: Adding missing tests or correcting existing tests

##### Summary

Use the summary field to provide a succinct description of the change:

* all lowercase.
* present tense.
* concise.

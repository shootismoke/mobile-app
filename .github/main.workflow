workflow "CI" {
  on = ["push", "pull_request"]
  resolves = ["yarn test"]
}

action "setup" {
  uses = "actions/checkout@v1"
  runs = "yarn"
  args = "lint"
}

action "yarn test" {
  needs = "setup"
  uses = "actions/checkout@v1"
  runs = "yarn"
  args = "test"
}
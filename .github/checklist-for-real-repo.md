Ideas:
- Should we have release branches? If we have a bug fix on a previous version, how do we fix it? Do we want to support anything but the latest?
- Issue and Feature request templates

Security:
- Protect Master Branches
- Protect Release Branches (If any)
- Require pull request approvals before merging (or restrict who is allowed to push to protected branches)
- Require status checks to pass before merging
- Require branches to be up to date before merging

Testing:
- Code Coverage
- Terraform Sentinel Checks?
- Terraform Testing?

Ideas:
- Version branches are pushed to their own respective release branches, sorted by major version. Allows us to patch older versions more easily. (If even desired)
- probot.github.io (Node.js apps that extend and automate workflow) On this site they have a bot that can auto close issues that do not match our templates.

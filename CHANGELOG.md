# 1.0.0 (2023-06-14)


### Bug Fixes

* 🐛 Update dependencies to remove security issue ([c7d44d5](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning-module/commit/c7d44d52ff97740e94c20635487eadfd6c7c8dd6))


### Features

* 🎸 Update for Node18.X ([a69bb50](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning-module/commit/a69bb5052b124e3bbbc1b12cda198246200f49f2))

## [2.3.2](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.3.1...v2.3.2) (2022-05-27)


### Bug Fixes

* 🐛 Minor change to a debug statement ([2ca2c00](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/2ca2c0040c6bf57a208cacfac0e0bc2c1fa0ada3))

## [2.3.1](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.3.0...v2.3.1) (2022-05-27)


### Bug Fixes

* 🐛 Set required AWS provider version ([87ddc9d](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/87ddc9d71e742cbd0555da298cacdf7527e8528f))

# [2.3.0](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.2.2...v2.3.0) (2022-05-27)


### Features

* 🎸 change the sysout ([e522b7a](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/e522b7a46defd43250154135d95d6ac1dfb0e012))
* 🎸 New description on the lambda, also upgrade runtime ([688244c](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/688244c1e4638047864cde7ddc848c1ac1667efc))

## [2.2.2](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.2.1...v2.2.2) (2022-05-27)


### Bug Fixes

* 🐛 Forgot to put count on the alarms ([9599904](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/9599904d200399bb252235c92b69486a04ff79b1))

## [2.2.1](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.2.0...v2.2.1) (2022-05-27)


### Bug Fixes

* 🐛 Make emails a set ([8021226](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/8021226498c51f801eb7c00668620d3028a8a094))

# [2.2.0](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.1.0...v2.2.0) (2022-05-25)


### Bug Fixes

* 🐛 Fix Terraform code ([99d0330](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/99d03303bd2e1faf363b15285c1226172bed9bab))


### Features

* 🎸 Alarms can now be created ([464a8c7](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/464a8c7ae18daec44046619e94918767184b09c2))

# [2.1.0](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v2.0.0...v2.1.0) (2022-05-24)


### Features

* 🎸 Add debug statement for CloudTrail searching ([2d7dafa](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/2d7dafa2eb77487c565ea9fdaee62ac46f6a4296))

# [2.0.0](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v1.1.1...v2.0.0) (2022-05-18)


### Features

* 🎸 Major refactor to rely on different fields ([db78435](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/db784355b46cf432ab8e14dd4ad4d1b2717750f5))
* 🎸 Tighten up IAM permissions for Lambda ([1352af2](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/1352af2e6227b2aec2c4628c66938253068afddd))


### BREAKING CHANGES

* 🧨 Field match changes

## [1.1.1](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v1.1.0...v1.1.1) (2022-05-13)


### Bug Fixes

* 🐛 Pull email from email field instead of principalid field ([51e61a8](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/51e61a8a707b8e3b21838ff269e0b58062b72ffc))

# [1.1.0](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v1.0.2...v1.1.0) (2022-05-13)


### Features

* 🎸 Minor change to debug logs ([a29b05f](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/a29b05ffd4a94d9a86e85e562da3ad66bbb9a12b))

## [1.0.2](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v1.0.1...v1.0.2) (2022-05-13)


### Bug Fixes

* 🐛 Minor fix to the console debug ([747a380](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/747a380f1def1d04f407bfbce88da7eff7df516c))

## [1.0.1](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/compare/v1.0.0...v1.0.1) (2022-05-13)


### Bug Fixes

* 🐛 Fix Terraform for bad null check ([516ea95](https://github.com/StateFarmIns/terraform-aws-quicksight-user-pruning/commit/516ea95c5a97bcdfc2d9727bb5ac4b95d3fa7496))

# 1.0.0 (2022-05-13)


### Features

* 🎸 Allow passing in of SES domain ([274b10f](https://github.com/StateFarmIns/quicksight-pruning-test/commit/274b10f2853018f0b1de5eff42c354ac3bcdff90))

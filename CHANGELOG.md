# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.0.2] - 2022-06-04

### Fixed

- Fixed the store collision issues in production due to functions becoming
  one-letter when minified. Added `getStoreName` static method as part of the
  store constructable to enforce store name definition.

## [0.0.1] - 2022-05-25

### Added

- Initial release.

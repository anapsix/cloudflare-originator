# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2019-05-02
### Added
- getWorkerIP option, to disable checking worker IP, even when debug is on
- cdnCatchAll option, to control request pass-through when path match is
  not found in pathMap, helpful when CDN hostname is same as main site

## [1.0.1] - 2019-04-11
### Added
- return 404 if origin response code is not 200
- use passThroughOnException if worker fails

## [1.0.0] - 2019-04-10
### Added
- Initial revision.
- May contain bugs.
- App creation driven by internal usage/need.
- Your mileage may vary.

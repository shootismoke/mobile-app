# Contributing to Shoot! I Smoke

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

-   Reporting a bug
-   Discussing the current state of the code
-   Submitting a fix
-   Proposing new features
-   Becoming a maintainer

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use Github Flow, So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be transferred to us

When you submit code changes, we ask you to sign a CLA: https://cla-assistant.io/amaurymartiny/shoot-i-smoke, which transfer your submissions to the authors Marcelo S. Coelho and Amaury M. We then release these submissions under the [GPL-3.0 License](https://choosealicense.com/licenses/gpl-3.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/shootismoke/mobile-app/issues); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

-   A quick summary and/or background
-   Steps to reproduce
    -   Be specific!
    -   Give sample code if you can.
-   What you expected would happen
-   What actually happens
-   Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Use a Consistent Coding Style

We use an opiniated `eslint`, which is configured to behave like `prettier` + `@typescript-eslint/recommended`.

Run `yarn lint` to make sure that your code passes linting. You can optionally add the `--fix` flag to let `eslint` automatically fix some errors.

There's two additional rule that are not (yet?) implemented in `eslint`: imports ordering & props/destructuring ordering. This is right now only enforced by PR reviewers.

### Imports Ordering

The `import ... from '...';` at the top of files follow some rules:

-   Absolute imports before relative imports

```diff
- import { Cigarettes } from './Cigarettes';
- import React from 'react';
+ import React from 'react';
+ import { Cigarettes } from './Cigarettes';
```

-   Absolute imports are sorted alphabetically by package name

```diff
- import { StackNavigation } from 'react-navigation';
- import React from 'react';
+ import React from 'react';
+ import { StackNavigation } from 'react-navigation';
```

-   Relative imports are reverse-sorted by import depth, meaning deeper imports appear first

```diff
- import { Cigarettes } from './Cigarettes';
- import { ApiContext }  from '../../stores';
+ import { ApiContext }  from '../../stores';
+ import { Cigarettes } from './Cigarettes';
```

-   Imports at the same depth are sorted alphabetically by module name

```diff
- import { Cigarettes } from './Cigarettes';
- import { Background }  from './Background';
+ import { Background }  from './Background';
+ import { Cigarettes } from './Cigarettes';
```

### Props/Destructuring Ordering

-   Destructured fields are ordered alphabetically

```diff
- import { useState, useContext } from 'react';

- const { width, height } = props;

+ import { useContext, useState } from 'react';

+ const { height, width } = props;
```

-   Props in React components are ordered alphabetically

```diff
- <Cigarettes style={{ width: 30 }} cigarettes={2} />
+ <Cigarettes cigarettes={2} style={{ width: 30 }} />
```

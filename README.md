# Frontend (Practice Module)

Documentation WIP

### Getting Started

1. Install via `npm i`
2. Run `npm run prepare` to setup husky into your repository (one-time setup)
3. Start the application locally via `npm run dev`

### Running Tests

Run unit tests by running the following command:
`npm run test`

### Commit Message Guidelines

`husky` is used as a commit linting tool to check and enforce a [commit message guideline](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

Get husky setup by running `npm run prepare`.

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Example:

```
feat: add user login page
```

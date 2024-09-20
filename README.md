# Frontend (Practice Module)

Documentation WIP

### Getting Started

1. Ensure node is installed on your machine
2. Install Prettier extention on VSCode

### Commands

#### npm

`npm i` - install project dependencies  
`npm run prepare` to setup husky (one-time setup)  
`npm run dev` - start application locally on localhost:3000

#### Docker

```sh
# build a docker container named feats-frontend with the latest tag
docker build -t feats-frontend .

# run the docker container on port 3000
docker run -d -p 3000:80 feats-frontend
```

### Running Tests

Run unit tests by running the following command:
`npm run test`

### Folder Structure

```
🗂️── __tests__               Unit tests
🗂️── dist                    Compiled files
🗂️── src                     Source files
|  ├──🗂️ __mock              Mock data
|  ├──🗂️ components          Components used throughout the application
|  ├──🗂️ hooks               Custom React hooks
|  ├──🗂️ layouts             Overall application presentation layer
|  ├──🗂️ pages               Specific pages of application
|  ├──🗂️ routes              Routing for different pages
|  ├──🗂️ sections            Module-specific views
|  ├──🗂️ theme               Themes for components and application
|  ├──🗂️ utils               Other helpful utility functions
|  ├── README.md
|  └── package.json          Project dependencies
└── ...
```

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

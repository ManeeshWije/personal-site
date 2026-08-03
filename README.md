# Personal Website

- An interactive terminal style website where people can gain more info about me, written in TypeScript React.

### Developing

This project uses nix flakes for development. To get started, you can run the following command to enter a development shell:

```bash
nix develop
```

Within the development shell, you can run the following command to start the development server:

```bash
npm run dev
```

For deployment, we use nix2container to build and push the docker image to dockerhub

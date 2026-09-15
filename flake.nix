{
  description = "Personal website container image";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    nix2container = {
      url = "github:nlewo/nix2container";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    nix2container,
    self,
    ...
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
    ];

    eachSystem = f:
      nixpkgs.lib.genAttrs systems (
        system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
            nix2container =
              nix2container.packages.${system}.nix2container;
          }
      );
  in {
    packages = eachSystem (
      {
        pkgs,
        nix2container,
        system,
        ...
      }: let
        site = pkgs.buildNpmPackage {
          pname = "personal-website";
          version = "0.0.0";

          src = pkgs.lib.cleanSource ./.;

          # Run `nix build .#site` once and replace this with the
          # sha256 hash shown in the error message.
          npmDepsHash = "sha256-x43jpFSVPnTypnC2AhnQdJoQadQKy9ODBZBxBI5xJRE=";

          npmBuildScript = "build";

          installPhase = ''
            runHook preInstall

            mkdir -p $out/app

            cp package.json $out/app/
            cp vite.config.ts $out/app/

            cp -r dist $out/app/
            cp -R node_modules $out/app/node_modules

            runHook postInstall
          '';
        };

        image = nix2container.buildImage {
          name = "docker.io/maneeshwije/personal-website";
          tag =
            if system == "x86_64-linux"
            then "amd64"
            else if system == "aarch64-linux"
            then "arm64"
            else throw "Unsupported system: ${system}";

          copyToRoot = [site pkgs.busybox];

          config = {
            WorkingDir = "/app";

            Cmd = [
              "${pkgs.nodejs}/bin/npm"
              "run"
              "preview"
              "--"
              "--config"
              "/app/vite.config.ts"
              "--host"
              "0.0.0.0"
              "--port"
              "4173"
            ];

            Env = [
              "HOME=/tmp"
              "NODE_ENV=production"
            ];

            ExposedPorts = {
              "4173/tcp" = {};
            };

            Labels = {
              "org.opencontainers.image.source" = "https://github.com/ManeeshWije/personal-site";
            };
          };
        };
      in {
        default = image;

        inherit site image;
      }
    );

    apps = eachSystem (
      {system, ...}: let
        image = self.packages.${system}.image;
      in {
        push = {
          type = "app";
          program = "${image.copyToRegistry}/bin/copy-to-registry";
        };
      }
    );

    devShells = eachSystem (
      {pkgs, ...}: {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs
            pkgs.corepack
            pkgs.typescript
          ];
        };
      }
    );
  };
}

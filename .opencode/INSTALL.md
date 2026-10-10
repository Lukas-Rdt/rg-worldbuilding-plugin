# Installing RG Worldbuilding for OpenCode

Add RG Worldbuilding to the `plugin` array in your global or project `opencode.json`:

```json
{
  "plugin": ["rg-worldbuilding@git+https://github.com/Lukas-Rdt/rg-worldbuilding-plugin.git"]
}
```

Restart OpenCode after changing the config. The OpenCode plugin registers the RG Worldbuilding skills directory directly; no Bun installer or generated skill copy is required.

To pin a release, add a tag. Replace `X.Y.Z` with the release you want — see the [releases page](https://github.com/Lukas-Rdt/rg-worldbuilding-plugin/releases) for available tags:

```json
{
  "plugin": ["rg-worldbuilding@git+https://github.com/Lukas-Rdt/rg-worldbuilding-plugin.git#rg-worldbuilding-vX.Y.Z"]
}
```

## Local Development

From this checkout, point OpenCode at the package path:

```json
{
  "plugin": ["/path/to/rg-worldbuilding-plugin"]
}
```

Restart OpenCode after changing the package source.

# Popout Resizer

Popout Resizer lets you resize Foundry VTT sidebar popout windows, including combat, scenes, actors, journals, items, roll tables, playlists, compendiums, and settings.

## Install

In Foundry, open **Add-on Modules > Install Module**, paste a manifest URL into **Manifest URL**, and install.

Official upstream channel:

```text
https://raw.githubusercontent.com/Cardagon/popout-resizer/master/module.json
```

Spencer's Foundry V14 compatibility build:

```text
https://github.com/SpencerZPoole/popout-resizer/releases/latest/download/module.json
```

After installation, enable **Popout Resizer** in your world's **Manage Modules** menu.

## Compatibility

- Module version: `1.6.1`
- Foundry minimum: `13`
- Verified with Foundry: `14.362`

This release keeps the original module behavior while making sidebar popout resizing work with Foundry's V13/V14 application rendering.

## Features

- Adds resize support to Foundry sidebar popouts.
- Supports default sidebar popout width and height settings.
- Can remember sidebar popout size and position between sessions.
- Keeps combat tracker scroll-to-turn behavior when reopening remembered combat popouts.

## Changes

### `1.6.1`

- Verified against Foundry `14.362`.
- Updated compatibility metadata for Foundry V14 and removed the stale maximum-version cap.
- Ported the useful V13/ApplicationV2 sidebar popout work from PR [#22](https://github.com/Cardagon/popout-resizer/pull/22), credited to iconmaster5326.
- Added V14-aware `renderApplicationV2` handling for sidebar popouts.
- Uses Foundry's current `foundry.applications.ux.Draggable` class when available.
- Hardened resize setup for missing handles and repeated renders.
- Fixed saved-size setting updates so stored dimensions remain an object.

## Credits

Popout Resizer was created by Cardagon. This release credits iconmaster5326 for the prior V13 sidebar popout work in PR [#22](https://github.com/Cardagon/popout-resizer/pull/22), which informed the V14 compatibility update here.

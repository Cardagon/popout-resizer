# Popout Resizer

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/cardagon/popout-resizer?style=for-the-badge)  ![GitHub Releases](https://img.shields.io/github/downloads/cardagon/popout-resizer/latest/total?style=for-the-badge) ![GitHub All Releases](https://img.shields.io/github/downloads/cardagon/popout-resizer/total?style=for-the-badge&label=Downloads+total)

A [FoundryVTT](http://foundryvtt.com/) module to give the users the ability to resize their pop-out windows from the side toolbar.

# Installation

## Recommended

1. Go to Foundry's Setup screen
1. Go to the "Add-On Modules" tab
1. Press "Install Module"
1. Paste `https://raw.githubusercontent.com/Cardagon/popout-resizer/master/module.json` into the text field
1. Press "Install"

# Features
- All popouts from the side bar are resizable (minimum height and width is 200 px)
    - Combat Tracker
    - Scenes
    - Actors
    - Journals
    - Items
    - Tables
    - Playlists
    - Compendiums
    - Configuration
- A default height and width can be set in the configuration menu for popouts
- The size and position of popouts can be remembered in between session to maintain preferred layouts

# Contact

If you have any questions about the module or troubles, feel free to create an issue here or send me a ping in the FoundryVTT discord channel @Cardagon

# Updates

## 1.4 - 2020-07-08
- Add support for localization

## 1.1 - 2020-10-21
- Confirmed support for Foundry Core 0.7.5

## 1.0 - 2020-7-3
- Added scroll to turn so that switching to next turn / previous turn does scroll to top for combat tracker
- Changing remember last popout size to true by default
- Stable release

## 0.7 - 2020-6-25
- Changed scripts to esmodules
- Resolved issue where pin-cushion was grabbing wrong registerSettings method this has been resolved by using esmodules

## 0.6 - 2020-6-23
- Added configuration menu
    - Default Width
    - Default Height
    - Remember Size and Position
- Popouts will now be opened according to the default width and height set in configuration menu (set per user)
- If the "Remember Size and Position" option is enabled popouts will now re-open to the same size and position they were last closed at
    - This is remembered in between sessions
    - This is per user
- Cleaned up code and removed some redundancies 

## 0.5 - 2020-6-22
- Migrated repo to github from gitlab, no feature changes

## 0.4 - 2020-6-19
- Fixing error introduced in 0.3

## 0.3 - 2020-6-19
- Adding support for PF2E

## 0.2 - 2020-6-18
- Fixing bug that would remove re-sizing when ending turn, or changing turn on the combat tracker

## 0.1 - 2020-6-16
- Ability to re-size popouts from the side toolbar
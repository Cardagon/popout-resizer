# Popout Resizer

A [FoundryVTT](http://foundryvtt.com/) module to give the users the ability to resize their pop-out windows from the side toolbar.

# Installation

## Recommended

1. Go to Foundry's Setup screen
1. Go to the "Add-On Modules" tab
1. Press "Install Module"
1. Paste `https://gitlab.com/cardagon/popout-resizer/-/raw/master/module.json` into the text field
1. Press "Install"

## Alternative

1. Download [this zip file](https://gitlab.com/cardagon/popout-resizer/-/jobs/artifacts/master/download?job=zip)
2. Extract it into the `<FoundryVTT directory>/resources/app/public/modules`-folder

# Features

Resize your pop-outs to fit your needs.
The combat tracker can be a little large when popped out especially when you have a large number of combatants.
This can be used to resize the popup to be smaller while still providing a scroll bar to allow easy access to all required information.



# Notes

I originally designed this with the combat tracker in mind so it is really the only one I have extensively tested.
That being said this module should work with any of the popout windows from the toolbar menu.
Currently there is still a restriction on the min width and height of the window but I am currently working on removing that so you will have full control over the size of the pop-up.

# Contact

If you have any questions about the module or troubles, feel free to create an issue here or send me a ping in the FoundryVTT discord channel @Cardagon

# Updates

## 0.2 - 2020-6-18
- Fixing bug that would remove re-sizing when ending turn, or changing turn on the combat tracker

## 0.1 - 2020-6-16
- Ability to re-size popouts from the side toolbar
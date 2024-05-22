# Crazy Eights Online Game - Testing Document

## CONTENTS
* [Manual Testing](#Manual-Testing)
  * [Full Testing](#Full-Testing)
  * [W3C Validator](#W3C-Validator)
  * [Lighthouse Testing](#Lighthouse-Testing)
  * [Wave Accessibiliy Testing](#Wave-Accessibility-TSesting)
  * [Bugs](#Bugs)
    * [Solved Bugs](#Solved-Bugs)
  * [Testing User Stories](#Testing-User-Stories)
  * [Other Testing](#Other-Testing)
* [Automated-Testing](#Automated-Testing)

## Manual Testing

The site was tested on the following systems:

* Cyberpower Ryzen 5 - OS: Windows 11 v23H2
* Samsung Galaxy A52S 5G

This was also tested on the following browsers:

* Google Chrome - Version 125.0.6422.77 (64-bit)
* Microsoft Edge - Version 125.0.2535.51 (64-bit)
* Mozilla Firefox - Version 126.0 (64-bit)

### Home Page Testing
**Feature**|**Expected Outcome**|**Test Action**|**Result**|**Pass/Fail**
:-----:|:-----:|:-----:|:-----:|:-----:
Rules Modal Home Page|Rules modal should appear|Click Rules button|Rules modal opened|Pass
Rules Modal Home Page (Phone Size Screen)|Rules modal should appear|Click Rules button|Rules modal opened|Pass
Start Game Button Large Screens|HTML updates to username enter field|Click Start New Game button|HTML updates|Pass
Start Game Button Phone Size Screens|HTML updates to username enter field|Click Start New Game button|HTML updates|Pass
Username Empty Check|User is prompted for username|Click Start Game with empty text field|user cannot proceed|Pass
Username Not Empty Check|user is taken to the game page|Press the Start Game button with value in text field|game.html is loaded|Pass

### Game Page Testing

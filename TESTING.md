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

### Full Testing

The site was tested on the following systems:

* Cyberpower Ryzen 5 - OS: Windows 11 v23H2
* Samsung Galaxy A52S 5G

This was also tested on the following browsers:

* Google Chrome - Version 125.0.6422.77 (64-bit)
* Microsoft Edge - Version 125.0.2535.51 (64-bit)
* Mozilla Firefox - Version 126.0 (64-bit)

#### Home Page Testing

**Feature**|**Expected Outcome**|**Test Action**|**Result**|**Pass/Fail**
:-----:|:-----:|:-----:|:-----:|:-----:
Rules Modal Home Page|Rules modal should appear|Click Rules button|Rules modal opened|Pass
Rules Modal Home Page (Phone Size Screen)|Rules modal should appear|Click Rules button|Rules modal opened|Pass
Start Game Button Large Screens|HTML updates to username enter field|Click Start New Game button|HTML updates|Pass
Start Game Button Phone Size Screens|HTML updates to username enter field|Click Start New Game button|HTML updates|Pass
Username Empty Check|User is prompted for username|Click Start Game with empty text field|user cannot proceed|Pass
Username Not Empty Check|user is taken to the game page|Press the Start Game button with value in text field|game.html is loaded|Pass

#### Game Page Testing

**Feature**|**Expected Outcome**|**Test Action**|**Result**|**Pass/Fail**
:-----:|:-----:|:-----:|:-----:|:-----:
Card Choice |Displays the options to play the selected card -  yes or no|Click a clickable card|Play card button section is displayed|Pass
Card Choice - Phone Screens|Diplays the play card options in a modal|Click a clickable card|Play card modal is displayed|Pass
Yes Button|Lays the card to the pile and calls the next turn - card is removed from player's hand|Click play card? - yes|Card is layed and next turn is called. Card is also removed from hand|Pass
No Button|removes play card options|Click play card? - no|play card button section removed|Pass
Rules Button Game Page|displays the rules modal when clicked|Click Rules button|Rules modal displayed|Pass
Exit Button|displays a modal asking if the player is ure|Click Exit button|Modal displayed|Pass
Game State text field|displays text showing what action has just happened with each turn|take Player turn|Text updates with each turn e.g. Player lays 4 of HEARTS|Pass
Clicking an 8 Card|Displays a different set of buttons that allows the user to choose a suit as well|Clicking a card with the value of 8|Displays a 4 yes options with each suit labelled and a no button to cancel the choice|Pass
Clicking an 8 Card - Phone Screens|Displays a different modal that allows the user to choose a suit as well|Clicking a card with the value of 8|Displays a modal with  4 yes options with each suit labelled and a no button to cancel the choice|Pass
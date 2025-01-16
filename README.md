# Delivery Time - low_budget_device

A Labor timer written in plain html, css, and javascript. <br/>
Designed for low budget phones, specifically kaios devices with a standard screen size of 240x320 pixels. <br/>
A purely client side implementation, labor history is saved in the user's browser with IndexedDB.

| Contraction Info        | Energy Info    | Settings  |
| :-------------: |:-------------:| :-----:|
| ![Contraction Info](https://github.com/t2techno/DeliveryTime/blob/readMe/low_budget_device_screenshots/contractionInfo.png?raw=true "Contraction Info") | ![Energy Info](https://github.com/t2techno/DeliveryTime/blob/readMe/low_budget_device_screenshots/energyInfo.png?raw=true "Energy Info") | ![Settings](https://github.com/t2techno/DeliveryTime/blob/readMe/low_budget_device_screenshots/settingsInfo.png?raw=true "Settings")

## Features
- Contraction Info
  - Toggle for displaying average or latest information
  - Labor start time
  - Length of last contraction
    - or average length of last 5 contractions
  - Time between last two contractions
    - or average time between last 6 contractions
  - Contraction Count
- Energy Info
  - Last time food was eaten
  - Last time liquid was drank
- Settings
  - Adjustable timer rate
    - Updating less often for low power mode
    - Update of 0 seconds displays contraction start time, rather than length
  - Reset button to clear all labor history information
 

## ToDo:
- Internationalization of text
- History page to list out labor history

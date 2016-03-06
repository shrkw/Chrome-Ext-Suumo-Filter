Suumo excluding filter
===========================

https://chrome.google.com/webstore/detail/suumo-properties-filter/mhigijcmdomdgemlkmhanebgdfjfglio

Development
----------------

### Setup your environment

#### Install nodebrew and Node.js

    curl -L git.io/nodebrew | perl - setup
    export PATH=$HOME/.nodebrew/current/bin:$PATH
    nodebrew install stable
    nodebrew use stable

#### Resolve project dependencies

    npm install

#### Watch file changes

    gulp

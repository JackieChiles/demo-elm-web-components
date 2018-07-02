#!/bin/sh

mkdir -p build
elm-make components/* --output=build/elm-web-components.js

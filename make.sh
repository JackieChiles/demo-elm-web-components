#!/bin/sh

mkdir -p build
elm-make components/numeric-stepper.elm --output=build/numeric-stepper.js

#!/bin/bash

# This script is used to distribute Manta rewards to configured addresses
yarn install && yarn build
yarn start >> distribution.log 2>&1
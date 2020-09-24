#!/bin/sh

export CONTENT_FILE=${PWD}/../resources/urls.txt
node ${PWD}/../slow_consumer.js

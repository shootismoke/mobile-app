#!/bin/bash
# Source: https://github.com/yaron1m/expo-detox-typescript-example/blob/master/scripts/dl_expo_bins
set -eo pipefail

# query expo.io to find most recent ipaUrl
IPA_URL=$(curl -sS https://expo.io/--/api/v2/versions | python2 -c 'import sys, json; print json.load(sys.stdin)["iosUrl"]')
# Skipping android apk dl for now
# APK_URL=$(curl -sS https://expo.io/--/api/v2/versions | python -c 'import sys, json; print json.load(sys.stdin)["androidUrl"]')

# download tar.gz
TMP_PATH_IPA=/tmp/exponent-app.tar.gz
curl -o $TMP_PATH_IPA "$IPA_URL"

# recursively make app dir
APP_PATH=bin/Exponent.app
mkdir -p $APP_PATH

# create apk (isn't stored tar'd)
# APK_PATH=bin/Exponent.apk
# curl -o $APK_PATH "$APK_URL"

# unzip tar.gz into APP_PATH
tar -C $APP_PATH -xzf $TMP_PATH_IPA

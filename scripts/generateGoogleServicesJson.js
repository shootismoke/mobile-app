#!/usr/bin/env node

/**
 * This script will take the `SIS_GOOGLE_SERVICES_JSON` string, parse it, and
 * output the parsed object. It is used to create the `google-services.json`
 * file in production. Doint JSON stringify+parse just to be sure that the env
 * variable is correctly set.
 */

console.log(JSON.stringify(JSON.parse(process.env.SIS_GOOGLE_SERVICES_JSON)));

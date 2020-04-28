#!/usr/bin/env node

/**
 * This script will take the `SIS_GOOGLE_SERVICES_JSON` string, parse it, and
 * output the parsed object. It is used to create the `google-services.json`
 * file in production.
 */

console.log(JSON.parse(process.env.SIS_GOOGLE_SERVICES_JSON));

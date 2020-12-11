#!/usr/bin/env node

import request = require('request');
import fs = require('fs');
import tmp = require('tmp');
import { spawnSync, execSync } from 'child_process';


function dlls(version:string):string[]
{
    return [
        `VCRUNTIME${version}.dll`,
        `VCCORLIB${version}.dll`,
        `MSVCP${version}.dll`,
        `MFC${version}.dll`,
        `MFC${version}U.dll`,
        `MFCM${version}.dll`,
        `MFCM${version}U.dll`,
        `VCAMP${version}.dll`,
        `VCOMP${version}.dll`,
    ];
}

(async()=>{
    try
    {
        for (const dll of dlls('140'))
        {
            execSync(`where ${dll}`);
        }
        console.log('Visual C++ 2015-2019 Redistributable (x64): Installed');
        return;
    }
    catch(err)
    {
    }
    console.log('Install Visual C++ 2015-2019 Redistributable (x64)');
    console.log('vc_redist.x64.exe Download');
    const file = tmp.fileSync({postfix:".exe", detachDescriptor: true});
    await new Promise(resolve=>{
        const s = fs.createWriteStream('', {fd: file.fd});
        request("https://aka.ms/vs/16/release/vc_redist.x64.exe").pipe(s)
        .once('close', resolve);
    });
    console.log('vc_redist.x64.exe Install');
    const res = spawnSync(file.name, ['/install', '/passive', '/norestart'], {stdio:'inherit'});
    file.removeCallback();
    if (res.status)
    {
        console.log(`vc_redist.x64.exe Install failed(${res.status})`);
    }
    process.exit(res.status || 0);
})().catch(err=>{
    console.error(err);
    process.exit(-1);
});
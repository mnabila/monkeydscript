// ==UserScript==
// @name                Monkey D Aria2
// @version             1.0.0
// @description         Automatically download file from file hosting with aria2-RCP.
// @author              mnabila
// @namespace           https://github.com/mnabila
// @license             MIT License
// @match               https://*.zippyshare.com/*
// @match               https://anonfiles.com/*
// @match               http://www.solidfiles.com/*
// @grant               none
// ==/UserScript==

(function () {
    'use strict';

    function sendNotification(body) {
        if (Notification.permission != 'granted') {
            Notification.requestPermission();
        }
        let notif = new Notification('Aria2 | Download', { body: body });
    }

    function download(url) {
        // TODO: fix cors, i think use mode no-cors is not fix this problem
        const uri = 'http://localhost:6800/jsonrpc';
        fetch(uri, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: Math.floor(Math.random() * 5),
                method: 'aria2.addUri',
                params: [[url]],
            }),
        });
        sendNotification(document.title);
    }

    function zippyshare() {
        const url = document.querySelector('a#dlbutton');
        download(url.href);
    }

    function solidfile() {
        const script = document
            .evaluate(
                "//script[contains(., 'downloadUrl')]",
                document,
                null,
                XPathResult.ANY_TYPE,
                null,
            )
            .iterateNext();
        const data = script.innerHTML;
        const result = JSON.parse(data.match('({.*})')[0]);
        download(result.downloadUrl);
    }

    function anonfiles() {
        const url = document.querySelector('a#download-url');
        download(url.href);
    }

    let hostname = window.location.hostname;

    if (hostname.includes('zippyshare')) {
        zippyshare();
    } else if (hostname.includes('anonfiles')) {
        anonfiles();
    } else if (hostname.includes('solidfile')) {
        solidfile();
    }
})();

// ==UserScript==
// @name         Better Hoyolab
// @namespace    http://tampermonkey.net/
// @version      2024-01-16.02
// @description  try to take over the world!
// @author       You
// @match        https://act.hoyolab.com/app/community-game-records-sea/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hoyolab.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    /**
     * Wait for an element to be available.
     */
    function waitForElem(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function modifyPage(hash) {
        if (hash.startsWith('#/ys/abyss?')) {
            // abyss, make it compact

            waitForElem('.floors-block .floor-item').then(() => {
                // reverse floors
                const floorsBlock = document.querySelectorAll('.floors-block');
                const floorItems = document.querySelectorAll('.floors-block .floor-item');

                for (let i = 1; i < floorItems.length; i++) {
                    floorsBlock[0].insertBefore(floorItems[i], floorItems[i-1]);
                }

                // make it compact
                document.querySelectorAll('.look-back--header').forEach(el => el.remove());
                document.querySelectorAll('.split-text').forEach(el => el.remove());
                document.querySelectorAll('.floor-index').forEach(el => el.remove());
                document.querySelectorAll('.floor-view .room-list').forEach(el => { el.style.padding = '12px 28px 12px'; });
                document.querySelectorAll('.floor-view .room-list .room').forEach(el => { el.style.borderTop = 0; el.style.padding = 0; });

            });

        }

        if (hash.startsWith('#/ys/role/all?')) {
            // all characters, make it compact
            waitForElem('.activity-card-pop').then(() => {
                $('.activity-card-pop').css({ margin: 1 });
                $('.activity-card-pop .star').remove();
                $('.activity-card-pop .name').remove();
                $('.activity-card-pop .level').css({ top: -22, position: 'relative', background: 'rgba(0,0, 0, 0.5)' });
                $('.activity-card-pop .avatar').css({ height: '100%', borderRadius: 0 });
                $('.activity-card-pop .role-medium-pos').css({ height: 98 });

            });
        }
    }


    let hash = '';
    setInterval(() => {
        if (location.hash !== hash) {
            hash = location.hash;
            modifyPage(hash);
        }
    }, 500);

    modifyPage(hash);
})();

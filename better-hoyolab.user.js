// ==UserScript==
// @name         Better Hoyolab
// @namespace    http://tampermonkey.net/
// @version      2024-01-16.03
// @description  try to take over the world!
// @author       You
// @match        https://act.hoyolab.com/app/community-game-records-sea/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hoyolab.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

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
                const floorsBlock = $('.floors-block');
                const floorItems = $('.floors-block .floor-item');

                for (let i = 1; i < floorItems.length; i++) {
                    floorsBlock[0].insertBefore(floorItems[i], floorItems[i-1]);
                }

                // make look-back header compact
                $('.strategy').remove();
                $('.look-back').css({ paddingTop: 0 });
                const lookbackContent = $('.look-back .look-back--content');
                lookbackContent.css({ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '0 32px 8px' });
                const lookbackContentLeft = $("<div>").prependTo(lookbackContent);
                $('.look-back .look-back--info_container').css({ padding: 0 }).appendTo(lookbackContentLeft);
                $('.look-back .look-back--content--role').appendTo(lookbackContentLeft);
                $('.look-back .look-back--content--rank .title').html($('.period').html());
                $('.period').remove();

                // make it compact
                $('.look-back--header').remove();
                $('.split-text').remove();
                $('.floor-index').remove();
                $('.floor-header').css({ padding: '6px 28px 0px' });
                $('.floor-item').css({ marginTop: 4 });
                $('.floor-view .room-list').css({ padding: '6px 28px 6px'});
                $('.floor-view .room-list .room').css({ borderTop: 0, padding: 0 });
                $('.floor-view .room-list .room .pc-content').css({ paddingBottom: 0, marginTop: 0 });

                // move room index to center, above the stars
                const rooms = $('.floor-view .room');

                for (let i = 0; i < rooms.length; i++) {
                    const oldStarsContainer = rooms.eq(i).find('.stars');
                    oldStarsContainer.css({ flexDirection: 'column' });
                    rooms.eq(i).find('.header .index').css({ color: '#fff', marginBottom: 2 }).appendTo(oldStarsContainer);
                    const starsContainer = $("<div>").appendTo(oldStarsContainer);
                    oldStarsContainer.find('img').appendTo(starsContainer);
                    rooms.eq(i).find('.header').remove();
                }

                // make character avatar compact
                $('.role-medium-pos').css({ height: 56 });
                $('.role-medium-pos .avatar').css({ height: '100%', borderRadius: 0 });
                $('.role-medium-pos .level').css({ top: -14, position: 'relative', background: 'rgba(0,0, 0, 0.5)' });

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


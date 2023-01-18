function tonaKonfiguratorEmbedSystem() {
    me = this;

    this.container;
    this.apiurl = '/?eID=tpkonfigapi';

    //this.host = 'https://tona2020b.typo3.animal.lemm.local';
    this.host = 'https://www.tona.de';

    this.postMessenger = function () {
        let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        let eventer = window[eventMethod];
        let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        eventer(messageEvent, function (e) {
            if ((typeof e.data === 'string') && (e.data.indexOf('tonaKonfigHeight:') > -1)) {
                let height = e.data.split('tonaKonfigHeight:')[1];
                height = parseInt(height) + 30; // add a bit of extra space as buffer
                document.getElementById('tonaKonfiguratorEmbedSystemIframe').height = height + 'px';
            }
            if ((typeof e.data === 'string') && (e.data.indexOf('href:') > -1) && document.getElementById('schornsteinberater_embed_iframe_backlink') !== null) {
                if (e.data.split('href:')[1] === 'schornsteinberater') {
                    document.getElementById('schornsteinberater_embed_iframe_backlink').style.display = 'none';
                } else {
                    document.getElementById('schornsteinberater_embed_iframe_backlink').style.display = 'inline';
                }
            }
        }, false);
    };

    /**
     *
     * @param {*} dataObj
     */
    this.request = function (dataObj) {
        dataObj.lang = 0;
        dataObj.baseurl = "";
        dataObj.requestmode = "vanilla";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", me.host + me.apiurl, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhttp.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Response
                let data = JSON.parse(this.responseText);
                if (typeof data === 'object') {
                    /**
                     * callback
                     */
                    if (typeof data.callback === 'string' && typeof me[data.callback] === "function") {
                        me[data.callback](data);
                    }
                }

            }
        };

        xhttp.send("data=" + encodeURIComponent(JSON.stringify(dataObj)));
    };
    /**
     *
     * @param {*} dataObj
     */
    this.requestJQuery = function (dataObj) {
        dataObj.lang = 0;
        dataObj.baseurl = "";
        $.ajax({
            url: me.apiurl,
            type: "POST",
            data: "data=" + encodeURIComponent(JSON.stringify(dataObj)),
            dataType: "json",
            error: function (jqXhr, textStatus, errorMessage) {
                console.log('-------------------');
                console.log(jqXhr);
                console.log(textStatus);
                console.log(errorMessage);
                console.log('-------------------');
            },
            success: function (data) {
                if (typeof data === 'object') {
                    /**
                     * callback
                     */
                    if (typeof data.callback === 'string' && typeof me[data.callback] === "function") {
                        me[data.callback](data);
                    }
                }
            }
        });
    };

    this.getOffset = function (el) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    };

    this.setResizeEvents = function () {
        let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        let eventer = window[eventMethod];
        let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        eventer(messageEvent, function (e) {
            if ((typeof e.data === 'string') && (e.data.indexOf('tonaKonfigHeight:') > -1)) {
                let height = e.data.split('tonaKonfigHeight:')[1];
                height = parseInt(height) + 30; // add a bit of extra space as buffer
                document.getElementById('tonaKonfiguratorEmbedSystemIframe').height = height + 'px';

            }
            if ((typeof e.data === 'string') && (e.data.indexOf('scrollTo:') > -1)) {
                let scrollY = e.data.split('scrollTo:')[1];
                scrollY = parseInt(scrollY) + 50;
                window.scrollTo(0, scrollY);
            }
            if ((typeof e.data === 'string') && (e.data.indexOf('setWarnMsgHeight') > -1)) {
                let message = 'setWarnMsgHeight:' +
                    (
                        (-1 * parseInt(document.getElementById('tonaKonfiguratorEmbedSystemIframe').getBoundingClientRect().top)) +
                        parseInt(me.getOffset(document.getElementById('tonaKonfiguratorEmbedSystemIframe')).top * 1)
                    )
                document.getElementById('tonaKonfiguratorEmbedSystemIframe').contentWindow.postMessage(message, "*");
            }
            if ((typeof e.data === 'string') && (e.data.indexOf('setLoaderHeight') > -1)) {
                let message = 'setLoaderHeight:' +
                    (
                        (-1 * parseInt(document.getElementById('tonaKonfiguratorEmbedSystemIframe').getBoundingClientRect().top)) +
                        parseInt(me.getOffset(document.getElementById('tonaKonfiguratorEmbedSystemIframe')).top * 1)
                    )
                document.getElementById('tonaKonfiguratorEmbedSystemIframe').contentWindow.postMessage(message, "*");
            }
        }, false);
    };

    this.init = function () {
        let schornsteinberater, schornsteinberater_page;

        document.addEventListener("DOMContentLoaded", function (event) {

            let data = {
                cmd: 'getEmbedMode',
                callback: 'startIframe',
                uid: me.getHid()
            };
            me.request(data);

        });
    }
    this.startIframe = function (data) {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let codeUrlPart = '';
        if (params.tonacode) {
            codeUrlPart = '&code=' + params.tonacode;
        }

        if (data.mode === 1) {

            // schornsteinberater = '<a target="schornsteinberater_embed_iframe" href="'+me.host+'/schornsteinberater?h='+me.getHid()+'&parentUrl='+window.location+codeUrlPart+'">zurück zur Übersicht</a><hr />';
            //
            schornsteinberater = '<a id="schornsteinberater_embed_iframe_backlink" href="javascript:history.back()">zurück</a><hr />';


            schornsteinberater_page = 'schornsteinberater';
        } else {
            schornsteinberater = '';
            schornsteinberater_page = 'konfigurator/konfiguratorembedded';
        }



        // schornsteinberater += '<iframe frameBorder="0" style="border:0" id="tonaKonfiguratorEmbedSystemIframe" width="100%" height="400px" ' +
        //     '                      src="https://www.tona.de/konfigurator/konfiguratorembedded?h='+me.getHid()+'&parentUrl='+window.location+codeUrlPart+'" />'
        schornsteinberater += '<iframe name="schornsteinberater_embed_iframe" frameBorder="0" style="border:0" id="tonaKonfiguratorEmbedSystemIframe" width="100%" height="400px" ' +
            // 'src="https://tona2020b.typo3.animal.lemm.local/konfigurator/konfiguratorembedded?h='+me.getHid()+'&parentUrl='+window.location+codeUrlPart+'" />'
            'src="' + me.host + '/' + schornsteinberater_page + '?h=' + me.getHid() + '&parentUrl=' + window.location + codeUrlPart + '"></iframe>'

            + '<hr /><div id="datenschutzhinweis_embed">Bei der Nutzung des TONA-Konfigurators werden Ihre IP-Adresse und weitere technische Informationen an den Server des Diensteanbieters TONA Tonwerke Schmitz GmbH übermittelt. Dies ist technisch erforderlich, um Ihnen die Inhalte anzeigen zu können. Durch diese Anwendung werden KEINE Cookies gesetzt.\n' +
            '                            <a href="' + me.host + '/embed-datenschutz?h=' + me.getHid() + '&parentUrl=' + window.location + codeUrlPart + '" target="schornsteinberater_embed_iframe">Weitere Informationen zum Datenschutz bei TONA finden Sie hier.</a></div>';






        schornsteinberater += '<style>' +
            '' +
            '#privacyModal button.privacyClose span {\n' +
            '  margin-left: 15px;\n' +
            '  white-space: nowrap;\n' +
            '}\n' +
            '\n' +
            '#privacyModal .privacyCloseContainer {\n' +
            '  background: #fff;\n' +
            '  border-bottom: 1px solid #ddd;\n' +
            '  padding: 7px 3px;\n' +
            '  cursor: pointer;\n' +
            '}\n    #privacyModal.show {\n' +
            '        display: block;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal {\n' +
            '        display: none;\n' +
            '        position: fixed;\n' +
            '        border: 1px solid #666;\n' +
            '        width: 95%;\n' +
            '        height: 90%;\n' +
            '        padding: 0px;\n' +
            '        margin: 5px;\n' +
            '        border: 3px solid #666;\n' +
            '        background-color: #fff;\n' +
            '        top: 50px;\n' +
            '        left: 50%;\n' +
            '        transform: translateX(-50%);\n' +
            '        overflow-x: hidden;\n' +
            '        overflow-y: hidden;\n' +
            '        z-index: 40000;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal .privacyContent {\n' +
            '        height: calc(100% - 43px);\n' +
            '        padding: 10px;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal button.privacyClose {\n' +
            '        background: #f18700;\n' +
            '        height: 28px;\n' +
            '        width: 22px;\n' +
            '        border: 1px solid transparent;\n' +
            '        transition: all 0.3s ease;\n' +
            '  text-shadow: none;\n' +
            '  color: #333333;\n' +
            '  font-weight: normal;\n' +
            '  text-transform: none;\n' +
            '  padding: 1px 6px;\n' +
            '  border-radius: 0;\n' +
            '  margin: 5px;\n' +
            '  position: relative;\n' +
            '  font-size: 16px;\n' +
            '  line-height: 1rem;' +
            '    }\n' +
            '\n' +
            '#privacyIframe {' +
            'width: 100%;' +
            'height:100%;' +
            '}' +
            '    #privacyModal button.privacyClose:before {\n' +
            '        content: \'X\';\n' +
            '        color: #ffffff;\n' +
            '        top: 0;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal button.privacyClose:hover {\n' +
            '\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal button.privacyClose:hover:before {\n' +
            '\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal button.privacyClose span {\n' +
            '        margin-left: 15px;\n' +
            '        white-space: nowrap;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal .privacyCloseContainer {\n' +
            '        background: #fff;\n' +
            '        border-bottom: 1px solid #ddd;\n' +
            '        padding: 7px 3px;\n' +
            '        cursor: pointer;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal .privacyCloseContainer:hover button {\n' +
            '        background: #ffffff;\n' +
            '        border: 1px solid #f18700;\n' +
            '    }\n' +
            '\n' +
            '    #privacyModal .privacyCloseContainer:hover button.privacyClose:before {\n' +
            '        color: #f18700;\n' +
            '    }\n' +
            '</style>'

        this.container = document.querySelector('#tonaKonfiguratorEmbedSystem');
        this.container.innerHTML = schornsteinberater;

        let privacyModal = '<div id="privacyModal">\n' +
            '        <div class="privacyCloseContainer">\n' +
            '            <button class="privacyClose"><span>Datenschutzbestimmungen schließen</span></button>\n' +
            '        </div>\n' +
            '        <div class="privacyContent"><iframe id="privacyIframe"></iframe></div>\n' +
            '    </div>';


        window.setTimeout(function () {
            document.body.innerHTML += privacyModal;
            window.setTimeout(function () {
                me.bindPrivacyModalLink();
            }, 100);
        }, 1500);
        //

        const iframe = document.querySelector('#tonaKonfiguratorEmbedSystemIframe');
        const scrolling = iframe.getAttribute('scrolling');
        iframe.setAttribute('scrolling', scrolling === 'yes' ? 'no' : 'yes');
        setTimeout(() => {
            iframe.setAttribute('scrolling', 'no');
        }, 1000);
        me.postMessenger();
        me.setResizeEvents();
    }

    this.bindPrivacyModalLink = function () {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let codeUrlPart = '';
        if (params.tonacode) {
            codeUrlPart = '&code=' + params.tonacode;
        }

        document.querySelector('#privacyModal .privacyCloseContainer').addEventListener('click', function () {
            document.querySelector('#privacyModal').classList.remove("show");
        });

        document.querySelector('#datenschutzhinweis_embed a, #tonaprodukte_configurator_userdata_body_datenschutz a').addEventListener('click', function (e) {
            e.preventDefault();

            // fetch(me.host+'/embed-datenschutz' /*, options */)
            //     .then((response) => response.text())
            //     .then((html) => {
            //         document.querySelector("#privacyModal .privacyContent").innerHTML = html;
            //     })
            //     .catch((error) => {
            //         console.warn(error);
            //     });


            document.querySelector('#privacyIframe').src = me.host + '/embed-datenschutz?embed=1&h=' + me.getHid() + '&parentUrl=' + window.location + codeUrlPart + '';

            // document.querySelector('#privacyModal .privacyContent').innerHTML='<object type="text/html" data="https://www.tona.de/embed-datenschutz" ></object>';
            document.querySelector('#privacyModal').classList.add('show');
            // me.postHeightToParent();
            // me.scrollTo('#privacyModal');
        });

    };

    this.getHid = function () {
        let hVar = document.querySelector('#tonaKonfiguratorEmbedSystemScript').getAttribute('h');
        console.log('h: ', hVar);
        return hVar;
    }

    this.init();
}

let tonaKonfiguratorEmbedSystemScript = new tonaKonfiguratorEmbedSystem();
console.log(tonaKonfiguratorEmbedSystemScript);
function init() {
    tabid = parseInt(location.hash.slice(1));
    get_data();
    $("#jslist").on("click", "li", function() {
        var li = $(this);
        $("#jslist>li").removeClass("selected");
        li.addClass("selected");
        printsrc(li);
        if (sidebarBox.classList.contains("active")) {
            sidebarBtn.classList.remove("active");
            sidebarBox.classList.remove("active");
        }
        return false;
    });
    var w = $(window);
    w.scroll(function() {
        var top = w.scrollTop();
        if (top > 0 && $("body").height() <= w.height() + top) printsrc(null, true);
    });
}

function get_data() {
    if (window.chrome && chrome.tabs) {
        var show_onclick = get_config("onclick");
        chrome.tabs.sendMessage(tabid, {
            showonclick: show_onclick
        }, data_received);
    } else data_received(debugdata);
}

function printsrc(li) {
    var index, arr, ol, item;
    if (!li) {
        li = $("li[class~=selected]");
        if (!li) return;
    }
    index = li.index();
    if (index < 0) return;
    ol = li.parent();
    if ("jslist" == ol.get(0).id) arr = data.js;
    item = arr[index];
    if (item.src) return; else buildlist(item);
    return item;
}

function buildlist(item) {
    var onFinish, s = item.data || item.inline;
    $(window).scrollTop();
    onFinish = function(txt) {
        $("#src>code").html(txt);
    };
    s = s.trim();
    s = js_beautify(s);
    setTimeout(function() {
        var result, headertext;
        hljs.configure({
            classPrefix: "hljs-"
        });
        result = hljs.highlight("javascript", s, true);
        onFinish(hljs.fixMarkup(result.value));
        $("#src>code").addClass("hljs javascript");
        headertext = item.inline.replace("pega.ui.TemplateEngine.", "");
        headertext = headertext.substring(0, headertext.indexOf("("));
        $("#srcview h2").text(headertext);
    }, 100);
}

function data_received(resp) {
    var jscount, jsinline, onclickcount, i, item;
    if (!resp) {
        chrome.extension.lastError;
        chrome.tabs.get(tabid, function(tab) {
            setTimeout(get_data, 500);
        });
        return;
    }
    data = resp;
    $("title").text("Metadata: " + resp.url.hostname);
    jscount = resp.js.length;
    jsinline = 0;
    onclickcount = 0;
    for (i = 0; i < jscount; i++) {
        item = resp.js[i];
        addtolist($("#jslist"), item);
        if (item.onclick) onclickcount += 1; else if (!item.src) jsinline += 1;
    }
}

function addtolist(ol, item) {
    var li, s = "<li>";
    s += "</li>";
    li = $(s);
    if (item.src) return;
    if (item.inline && !item.dynamic && item.inline.trim().startsWith("pega.ui.TemplateEngine")) {
        li.addClass("inline");
        item.inline = item.inline.replace("pega.ui.TemplateEngine.", "");
        item.inline = item.inline.substring(0, item.inline.indexOf("("));
        li.text(item.inline.substr(0, 60));
    } else {
        li.empty();
        li.css("display", "none");
    }
    item.li = li;
    ol.append(li);
}

var tabid, sidebarBox, sidebarBtn, pageWrapper, data = {};

window.addEventListener("load", function() {
    init();
});

sidebarBox = document.querySelector("#list"), sidebarBtn = document.querySelector("#btn"), 
pageWrapper = document.querySelector("#srcview");

sidebarBtn.addEventListener("click", function(event) {
    sidebarBtn.classList.toggle("active");
    sidebarBox.classList.toggle("active");
});

pageWrapper.addEventListener("click", function(event) {
    if (sidebarBox.classList.contains("active")) {
        sidebarBtn.classList.remove("active");
        sidebarBox.classList.remove("active");
    }
});

window.addEventListener("keydown", function(event) {
    if (sidebarBox.classList.contains("active") && 27 === event.keyCode) {
        sidebarBtn.classList.remove("active");
        sidebarBox.classList.remove("active");
    }
});
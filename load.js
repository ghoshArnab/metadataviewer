function build_response(request) {
    var arr_js = [];
    var is_initial = !request;
    try {
        get_js(arr_js, is_initial);
        var response = {
            url: location,
            js: arr_js
        };
    } catch (e) {
        return {
            err: "" + e
        };
    }
    return response;
}

function get_js(a, mark_initial) {
    var i, node;
    var nodes = document.getElementsByTagName("script");
    for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (!node.type || "text/javascript" == node.type) pick_node(node, a, mark_initial);
    }
}

function pick_node(node, array, mark_initial) {
    var src = node.href || node.src;
    if (src && startsWith("" + src, "chrome-extension:")) return null;
    var item;
    if (src) item = {
        src: src
    }; else item = {
        inline: node.innerText
    };
    if (mark_initial) node._xinit = true;
    if (!node._xinit) item["dynamic"] = true;
    array.push(item);
    return item;
}

function startsWith(s, sub) {
    return 0 === s.indexOf(sub);
}

var data = build_response(null);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var data = build_response(request);
    sendResponse(data);
});
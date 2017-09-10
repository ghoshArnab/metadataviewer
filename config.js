function get_config(key) {
    if (void 0 == localStorage.init) _init_config();
    var s = localStorage.c || '""';
    var c = JSON.parse(s);
    return c[key];
}

function save_config(c) {
    localStorage.c = JSON.stringify(c);
    localStorage.init = "1";
}

function _init_config() {
    var c = {};
    c.beautify = true;
    c.tooltip = true;
    c.isredcount = true;
    c.colorize = true;
    c.caching = false;
    c.onclick = false;
    save_config(c);
}
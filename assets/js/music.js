function set_music_category(change_to) {
    let page;
    if (change_to !== undefined) {
        page = change_to;
    } else {
        const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);
        page = get_params.get("music_category") ?? "bgm";
    }

    const url = new URL(location);
    url.searchParams.set("music_category", page);
    history.pushState(null, "", url);

    const promise = $.ajax({
        url: `subpages/music/${page}.html`,
        method: "GET",
        dataType: "html",
    })
        .done(function (response) {
            $("#music-main").html(response);
        })
        .fail(function (jq_XHR, text_status, error_thrown) {
            console.error("Error:", error_thrown);
        });

    return Promise.all([promise]);
}

function highlight_active_music_nav() {
    const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);

    $(document).find(".music-navbar-item").removeClass("music-navbar-selected");

    $(document)
        .find(`#nav-${get_params.get("music_category")}`)
        .addClass("music-navbar-selected");
}

function music_navbar_mouseover() {
    $(".music-navbar-item").on("mouseenter", function () {
        if ($(this).hasClass("music-navbar-selected")) return;

        $(document).find(".music-navbar-item").removeClass("music-navbar-selected");
        $(document).find(".music-navbar-item").removeClass("music-navbar-hover");
        $(this).addClass("music-navbar-hover");
    });

    $(".music-navbar-item").on("mouseleave", function () {
        $(this).removeClass("music-navbar-hover");
        highlight_active_music_nav();
    });
}

function music_navbar_routing() {
    $(".music-navbar-item").on("click", function () {
        const clicked_category = $(this).attr("id").replace("nav-", "");
        const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);

        if (clicked_category === get_params.get("music_category")) return;

        set_music_category(clicked_category).then(highlight_active_music_nav);
    });
}

function post_ajax_operations_music() {
    set_music_category();
    highlight_active_music_nav();
    music_navbar_mouseover();
    music_navbar_routing();
}

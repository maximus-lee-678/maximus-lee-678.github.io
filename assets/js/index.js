//# - ID
//. = class
let has_touch_screen = false;

function max_thesaurus() {
    const strings = ["🌳 A lush and pleasant land.", "🌴 A beam site of immeasurable safety.", "🌲 A lush and hospitable place."];

    $(document)
        .find(".banner")
        .html(strings[Math.floor(Math.random() * strings.length)]);
}

function flavour_generator() {
    const flavour_text = [
        // true survivor
        "Hear the ticking of the countdown clocks tonight...",
        "Crawling from the ashes, the phoenix rise again!",
        "We need a, living passion, to believe in!",
        "Burning hearts, and a brand-new feeling!",
        // apex
        "It's time. 싸우러 가자.",
        "I always kill the messenger. It's safer that way.",
        "What you see is not what you get.",
        "With an eye in the sky, there's nothing to fear.",
        // borderlands
        "Wow, I CAN do this all day.",
        "For an impenetrable shield stand inside yourself.",
        "Float like a butterfly...",
        "Win by a hare.",
        // dota
        "Brother, you're back! Me too!",
        "So what if I swagger?",
        "So much for peaceful applications.",
        "There is purity in silence.",
        // dragalia
        "Love wins again, darling!",
        "My love will never die!",
        "You think summer's hot? Try Mount Adolla.",
        "I think good dreams are in store for me tonight!",
        // ftl
        "Holy crap! A weapon is just floating in space!",
        "Send the crew to help! Giant alien spiders are no joke.",
        "Hold on! Let us try to purge the system code!",
        "- it's a second Rebel Flagship!",
        // hs
        "What is real?",
        "Seriously!?",
        "Everyone, get in here!",
        "Stand back and be amazed!",
        // mc
        "Testificates!",
        "Slow acting portals!",
        "Never dig down!",
        "Internet enabled!",
        // ow
        "It's high noon.",
        "Step right up.",
        "Someone call the undertaker.",
        "Like shootin' fish in a barrel.",
        // stardew
        "It's going to be a special day, I can sense it.",
        "Some things transcend time and space, kid.",
        "You've done Pelican Town a great service.",
        "Looks like decent weather for fishing, eh?",
        // terraria
        "The Blood Moon is rising...",
        "The Pumpkin Moon is rising...",
        "The Frost Moon is rising...",
        "Martians are invading!",
        // tf2
        "A little of the ol' 'chop-chop'!",
        "What da hell, who stopped pushin' the cart?!",
        "Cheers, mate!",
        "Get zem. Raus, Raus!",
    ];

    $(document)
        .find("#footer-flavour-text")
        .html(flavour_text[Math.floor(Math.random() * flavour_text.length)]);
}

function reload_flavour() {
    $("#footer-flavour-text").on("click", function () {
        flavour_generator();
    });
}

function highlight_active_main_nav() {
    const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);

    $(document).find(".main-navbar-item").removeClass("main-navbar-hover");

    $(document)
        .find(`#nav-${get_params.get("page")}`)
        .addClass("main-navbar-hover");
}

function main_navbar_mouseover() {
    $(".main-navbar-item").on("mouseenter", function () {
        if ($(this).hasClass("music-navbar-hover")) return;

        $(document).find(".main-navbar-item").removeClass("main-navbar-hover");
        $(this).addClass("main-navbar-hover");
    });

    $(".main-navbar-item").on("mouseleave", function () {
        $(this).removeClass("main-navbar-hover");
        highlight_active_main_nav();
    });
}

function main_navbar_routing() {
    $(".main-navbar-item").on("click", function () {
        const clicked_page = $(this).attr("id").replace("nav-", "");
        const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);

        if (clicked_page === get_params.get("page")) return;

        set_content(clicked_page).then(post_ajax_operations);
    });
}

function set_content(change_to) {
    let page;
    if (change_to !== undefined) {
        page = change_to;
    } else {
        const get_params = new URLSearchParams(!has_touch_screen ? window.location.search : document.location.search);
        page = get_params.get("page") ?? "home";
    }

    const promise = $.ajax({
        url: `${page}.html`,
        method: "GET",
        dataType: "html",
    })
        .done(function (response) {
            $("#content").html(response);

            const url = new URL(location);
            url.searchParams.set("page", page);
            history.pushState(null, "", url);
        })
        .fail(function (jq_XHR, text_status, error_thrown) {
            console.error("Error:", error_thrown);
        });

    return Promise.all([promise]);
}

function post_ajax_operations() {
    // rehighlight navbar for mobile, since there is no mouse to leave it
    has_touch_screen ? highlight_active_main_nav() : undefined;

    const url = new URL(location);

    // clear all other params
    switch (url.searchParams.get("page")) {
        case "music":
            for (let param of url.searchParams.keys()) {
                if (param !== "page" && param !== "music_category") {
                    url.searchParams.delete(param);
                }
            }
            break;
        default:
            for (let param of url.searchParams.keys()) {
                if (param !== "page") {
                    url.searchParams.delete(param);
                }
            }
            break;
    }
    history.pushState(null, "", url);

    switch (url.searchParams.get("page")) {
        case "projects":
            post_ajax_operations_projects();
            break;
        case "music":
            post_ajax_operations_music();
            break;
    }
}

$(document).ready(function () {
    if ("maxTouchPoints" in navigator) has_touch_screen = navigator.maxTouchPoints > 0;

    // For stuff from the loaded page
    set_content().then(function () {
        post_ajax_operations();
    });

    // For stuff not ajaxed
    max_thesaurus();
    flavour_generator();
    reload_flavour();
    main_navbar_routing();
    highlight_active_main_nav();
    main_navbar_mouseover();
});

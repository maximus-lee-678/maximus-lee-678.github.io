toggle_duration_ms = 100;

function toggle_all() {
    $("#project-expand-all").on("click", function () {
        $(".accordion-content").slideDown({
            duration: toggle_duration_ms,
            start: function () {
                $(this).css("display", "flex");
            },
        });

        $(".accordion-title-tech-logo-secondary-container").fadeIn({
            duration: toggle_duration_ms,
            start: function () {
                $(this).css("display", "flex");
            },
        });
    });

    $("#project-collapse-all").on("click", function () {
        $(".accordion-content").slideUp(toggle_duration_ms);
        $(".accordion-title-tech-logo-secondary-container").fadeOut(toggle_duration_ms);
    });
}

function accordion_functional() {
    $(".accordion-header").on("click", function () {
        const accordion_content = $(this).parent().find(".accordion-content");
        const accordion_secondary_logos = $(this).find(".accordion-title-tech-logo-container").find(".accordion-title-tech-logo-secondary-container");

        if (accordion_content.css("display") === "none") {
            accordion_content.slideDown({
                duration: toggle_duration_ms,
                start: function () {
                    $(this).css("display", "flex");
                },
            });
            accordion_secondary_logos.fadeIn({
                duration: toggle_duration_ms,
                start: function () {
                    $(this).css("display", "flex");
                },
            });
        } else {
            accordion_content.slideUp(toggle_duration_ms);
            accordion_secondary_logos.fadeOut(toggle_duration_ms);
        }
    });
}

function resize_gallery() {
    // scales down pictures in project gallery based on number of occurrences.
    let counts = {};

    $(".accordion-gallery-item").each(function () {
        let attributeValue = $(this).attr("gallery-group");
        counts[attributeValue] = (counts[attributeValue] || 0) + 1;
    });

    for (let key in counts) {
        $(`[gallery-group="${key}"]`).css("max-width", `${Math.floor(100 / counts[key])}%`);
    }
}

function gallery_click() {
    $(".accordion-gallery img").on("click", function (e) {
        $("body").css("overflow", "hidden");
        $("#overlay").css("display", "block");
        $("#big-picture-popup").css("display", "inline");

        position = e.target.getAttribute("pos");
        image_source = e.target.getAttribute("src");
        group = e.target.getAttribute("gallery-group");
        caption = e.target.getAttribute("alt");

        format_big_picture(image_source, group, caption, position);
    });

    $("#overlay, #big-picture-popup").on("click", function (e) {
        // check if clicked element is parent, not any children
        if (e.target === this) {
            $("body").css("overflow", "auto");
            $("#overlay").css("display", "none");
            $("#big-picture-popup").css("display", "none");
        }
    });
}

function format_big_picture(image_source, group, caption, position) {
    const img_regex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

    next_pos = Number(position) + 1;
    let next_element = $(`img.accordion-gallery-item[gallery-group="${group}"][pos="${next_pos}"]`);

    if (next_element.length === 0) {
        next_element = $(`img.accordion-gallery-item[gallery-group="${group}"][pos="1"]`);
        next_pos = 1;
    }

    const next_image_source = next_element[0].getAttribute("src");
    const next_group = next_element[0].getAttribute("gallery-group");
    const next_caption = next_element[0].getAttribute("alt");

    if (img_regex.test(image_source)) {
        document.getElementById("big-picture-popup").innerHTML = `<img class="big-picture-popup-image" src="${image_source}"></img>
    <figcaption>${caption}</figcaption>`;
    }

    $(".big-picture-popup-image").on("click", function () {
        format_big_picture(next_image_source, next_group, next_caption, next_pos);
    });
}

function post_ajax_operations_projects() {
    toggle_all();
    accordion_functional();
    resize_gallery();
    gallery_click();
}

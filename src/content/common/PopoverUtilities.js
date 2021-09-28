export function togglePopover(id) {
    const vis = document.getElementById(id).style.visibility;

    if (vis === "visible") {
        disablePopover(id);
    } else {
        enablePopover(id);
    }

    return vis !== "visible";
}

export function enablePopover(id) {
    const popover = document.getElementById(id);

    popover.style.visibility = "visible";
    popover.style.opacity = "1";
    popover.style.right = "0";
}

export function disablePopover(id) {
    const popover = document.getElementById(id);

    if (popover) {
        popover.style.visibility = "hidden";
        popover.style.opacity = "0";
        popover.style.right = "-33%";
    }
}

"use strict";

// $(document).on("click", ".dropdown-select > .dropdown-menu > li > a", function (e) {
//     e.preventDefault();
//     $(this).parents(".dropdown-select").find(".dropdown-title").html($(this).html());
// });
//
// $(document).on("keydown", ".dropdown-toggle > input", function (e) {
//     //38:方向键上,40:方向键下,27:esc
//     if (!/(38|40|27)/.test(e.which)) return;
//
//     e.preventDefault();
//     e.stopPropagation();
//
//     var $this = $(this).parent();
//     var $parent = $this.parent();
//     var isActive = $parent.hasClass('open');
//
//     var toggle = '[data-toggle="dropdown"]';
//     if (!isActive && e.which != 27 || isActive && e.which == 27) {
//         if (e.which == 27) $parent.find(toggle).trigger('focus');
//         return $this.trigger('click');
//     }
//
//     var $items = $parent.find('.dropdown-menu li:not(.disabled):visible a');
//
//     if (!$items.length) return;
//
//     var index = $items.index(e.target);
//     if (e.which == 38 && index > 0)                 index--;        // up
//     if (e.which == 40 && index < $items.length - 1) index++;        // down
//     if (!~index)                                    index = 0;
//
//     $items.eq(index).trigger('focus');
//
// });


/**
 * 通用alert或confirm弹窗
 * */
window.zhlModalTip = function (msg, okCallback, cancelCallback, title) {
    var $ok = $('#zhlAlert .btnOks'),
        $cancel = $('#zhlAlert .btnCancel');
    if (msg) {
        $('#zhlTipMsg').html(msg);
    }
    if (title) {
        $('#zhlTipTitle').text(title);
    }
    $ok.off('click');
    $cancel.off('click');
    $('#zhlAlert').modal({
        backdrop: false,
        keyboard: false
    });

    if (typeof okCallback == 'function') {
        $ok.on('click', function () {
            setTimeout(function () {
                okCallback();
            }, 500);
            // $('.modal-backdrop.fade.in').remove();
            $('#zhlAlert').modal('removeBackdrop');
        });
    } else {
        $ok.on('click', function () {
            // $('.modal-backdrop.fade.in').remove();
            $('#zhlAlert').modal('removeBackdrop');
        });
    }
    if (typeof cancelCallback == 'function') {
        $('#btnCancels').show();
        $cancel.on('click', cancelCallback);
    } else {
        $('#btnCancels').hide();
    }
};
import { doc } from "./doc";
import { start } from "./start";

export { api }

class api {
    static url = 'https://findapp.online/rest/support/';

    static chatTestrun() {
        $.ajax({
            url: api.url + 'chat/13130/testrun',
            type: 'GET',
            success() {
                if (confirm(this.responseText)) {
                    $.ajax({
                        url: '/rest/chat/13130',
                        type: 'POST'
                    });
                }
            }
        });
    }
    static convert(fields, values) {
        var o = {};
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].indexOf('.') > -1)
                o[fields[i].substring(fields[i].indexOf('.') + 1)] = values[i];
        }
        return o;
    }
    static delete(id) {
        var highlight = $('#' + id).parents('tr');
        highlight.css('background', 'yellow');
        setTimeout(function () {
            if (!confirm('Möchtest Du den Kontakt löschen?')) {
                highlight.css('background', '');
                return;
            }
            $.ajax({
                url: api.url + 'user/' + id,
                type: 'DELETE',
                success() {
                    highlight.remove();
                }
            });
        }, 50);
    }
    static feedback() {
        var e = $('#feedback_wrapper');
        if (e.length && e.css('display') != 'none') {
            e.css('display', 'none');
            return;
        }
        $.ajax({
            url: api.url + 'feedback',
            type: 'GET',
            success(r) {
                doc.feedback(r);
            }
        });
    }
    static log() {
        $.ajax({
            url: api.url + 'log?search=' + encodeURIComponent(doc.logSearch),
            type: 'GET',
            success(r) {
                doc.log(r);
                $('input.log_search').focus();
            }
        });
    }
    static init() {
        start.user = $('login input')[0].value;
        start.password = $('login input')[1].value;
        $.ajax({
            url: api.url + 'user',
            type: 'GET',
            success(r) {
                start.data = [];
                for (var i = 1; i < r.length; i++)
                    start.data.push(api.convert(r[0], r[i]));
                start.init();
            }
        });
    }
    static notification() {
        var ids = $('selection').parents('tr').children('td:nth-child(2)').map(function () {
            return $(this).text();
        }).get();
        if (ids.length == 0 || !$('notification textarea').val())
            return;
        var form = new FormData();
        form.append('ids', ids);
        form.append('text', $('notification textarea').val());
        form.append('action', $('notification input').val());
        $.ajax({
            url: api.url + 'notify',
            type: 'POST',
            data: form,
            success(r) {
                $('notification').css('display', 'none');
            }
        });
    }
    static resendRegistrationEmail(id) {
        var highlight = $('#' + id).parents('tr');
        highlight.css('background', 'yellow');
        setTimeout(function () {
            if (!confirm('Möchtest Du die Registrierungsemail erneut senden?')) {
                highlight.css('background', '');
                return;
            }
            $.ajax({
                url: api.url + id + '/resend/regmail',
                type: 'POST',
                success(r) {
                    highlight.css('background', '');
                }
            });
        }, 50);
    }
}
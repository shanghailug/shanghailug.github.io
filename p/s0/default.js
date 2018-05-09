var _tgt = "http://dyn.shlug.org/s0";

var _s0 = {};

_s0.update_stat = function(list) {
    var tbl_todo = $("#tbl-todo");
    var tbl_done = $("#tbl-done");

    tbl_todo.empty();
    tbl_done.empty();

    var total = 0;

    function add_row(tbl, tag, name, email, value, date, code) {
        var n1 = name;
        var e1 = email;

        function format_dt(dt) {
            function pad(s) {
                if (s.length < 2) s = '0' + s;
                return s;
            }

            month = pad('' + (dt.getMonth() + 1));
            day = pad('' + dt.getDate());
            year = pad('' + dt.getFullYear());

            hr  = pad('' + dt.getHours());
            min = pad('' + dt.getMinutes());

            return [year, month, day].join('-') + ' ' +
                [hr, min].join(':');
        }

        var t = date;
        if (Number.isInteger(t)) {
            var dt = new Date(date);

            t = $("<span>")
                .text(format_dt(dt))
                .css("font-family", "monospace");
        }

        if (n1 == "") { n1 = $("<em>").css("color", "gray").text("（匿名）"); }
        if (e1 == "") { e1 = $("<em>").css("color", "gray").text("（匿名）"); }

        tbl.append($('<tr>')
                   .append($(tag).append(n1))
                   .append($(tag).append(e1))
                   .append($(tag).text(value))
                   .append($(tag).append(t))
                   .append($(tag).text(code)));

    };

    add_row(tbl_todo, '<th>', "姓名", "邮箱", "金额", "时间", "捐款码");
    add_row(tbl_done, '<th>', "姓名", "邮箱", "金额", "时间", "捐款码");

    // sort by date, reversed
    list.sort(function (a, b) {
        return (a.date < b.date) ? 1 : ((a.date > b.date) ? -1 : 0);
    });

    list.forEach(function(l) {
        if (l.confirmed) {
            add_row(tbl_done, '<td>', l.name, l.email, l.value, l.date, l.code);

            total += l.value;
        }
        else {
            add_row(tbl_todo, '<td>', l.name, l.email, l.value, l.date, l.code);
        }
        console.log(l);
    });

    $("#total-number").text(total + " / 256");

    function set_style(tbl) {
        tbl.find("td,th").css("border", "1px solid black");
        tbl.css("border-collapse", "collapse")
            .css("width", "100%");


        tbl.find("td,th").css("padding", "0 1em 0 1em");
        tbl.find("td,th").css("text-align", "center");
    };

    set_style(tbl_todo);
    set_style(tbl_done);

};

$(function() {
    $( "#donate-form" ).submit(function(e) {
        e.preventDefault();

        var name = $("#name").val();
        var email = $("#email").val();

        $("#donate-form input").attr("disabled", "disabled");
        $("#submit").attr("value", "载入中...");

        // alert("name = " + name + ", email = " + email);

        $.ajax({
            url: _tgt + "/j",
            type: "get",
            data: { "name": name, "email": email },
            datatype: 'json',
            success: function(data) {
                var succ = data.succ;

                console.log(data.succ);
                console.log(data.curr);

                var n0 = $("<ul>")
                    .append($("<li>").text("姓名: " + data.curr.name))
                    .append($("<li>").text("邮箱: " + data.curr.email))
                    .append($("<li>").text("IP: " + data.curr.ip))
                    .append($("<li>").text("金额： " + data.curr.value))
                    .append($("<li>").text("捐款码： ")
                            .append($("<span>").text(data.curr.code)
                                    .css("color", "black")
                                    .css("font-family", "monospace")
                                    .css("font-weight", "normal")));

                var n1 = $("<div>").append(n0);

                if (!data.succ) {
                    n1.append($("<p>")
                              .css("font-style", "italic")
                              .css("color", "red")
                              .text("已有记录，提交失败。请修改姓名或邮箱，若匿名则请更换IP"));
                }

                $("#donate-form").replaceWith(n1);

                _s0.update_stat(data.list);

                // val = x;
                // id = x;
                // stat = x

            },
            error:function(){
                alert("Error");
            }
        });

    });
});

$(function () {
    $.ajax({
        url: _tgt,
        type: "get",
        datatype: 'json',
        success: function(data) {
            console.log(data);
            _s0.update_stat(data.list);
        },
        error:function(){
            alert("Error");
        }
    });
});
